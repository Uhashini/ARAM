const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const WitnessReport = require('../models/WitnessReport');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { findNearestPoliceStation } = require('../utils/policeStationMapper');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/evidence';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'evidence-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// Helper to calculate risk score
const calculateRiskScore = (data) => {
    const { riskAssessment, accused, incidentDescription } = data;
    let score = 'LOW';

    if (riskAssessment?.isVictimInImmediateDanger) return 'EMERGENCY';
    if (riskAssessment?.areChildrenAtRisk || accused?.hasWeapon === 'yes') return 'HIGH';
    if (riskAssessment?.isAccusedNearby || riskAssessment?.hasSuicideThreats) return 'MEDIUM';

    // Check for specific keywords in narrative if no flags set
    const keywords = ['kill', 'weapon', 'hospital', 'fracture', 'threat'];
    const narrative = incidentDescription?.toLowerCase() || '';
    if (keywords.some(k => narrative.includes(k))) score = 'MEDIUM';

    return score;
};

// Helper to suggest legal sections (India)
const suggestLegalSections = (abuseTypes = []) => {
    const mapping = {
        'physical': ['IPC 323 (Voluntary causing hurt)', 'IPC 325 (Grievous hurt)'],
        'sexual': ['IPC 354 (Assault or criminal force to woman with intent to outrage her modesty)'],
        'emotional': ['Domestic Violence Act 2005 (Section 3)'],
        'verbal': ['IPC 504 (Intentional insult with intent to provoke breach of the peace)'],
        'dowry-related': ['IPC 498A (Husband or relative of husband of a woman subjecting her to cruelty)', 'Dowry Prohibition Act'],
        'financial': ['Domestic Violence Act 2005']
    };

    let suggestions = new Set();
    abuseTypes.forEach(type => {
        if (mapping[type]) mapping[type].forEach(s => suggestions.add(s));
    });

    return Array.from(suggestions);
};

// @route   POST api/witness/report
// @desc    Submit an enhanced witness report (structured like FIR)
// @access  Public (Optional Auth)
router.post('/report', optionalAuth, upload.array('evidence', 10), async (req, res) => {
    try {
        // Parse the reportData from FormData
        const reportData = req.body.reportData ? JSON.parse(req.body.reportData) : req.body;

        // Process uploaded evidence files
        if (req.files && req.files.length > 0) {
            reportData.evidence = req.files.map(file => ({
                fileType: file.mimetype,
                fileName: file.filename,
                filePath: file.path,
                fileSize: file.size,
                uploadedAt: new Date()
            }));
        }

        // 1. Calculate Risk Score
        if (!reportData.riskAssessment) reportData.riskAssessment = {};
        reportData.riskAssessment.riskScore = calculateRiskScore(reportData);

        // 2. Suggest Legal Sections
        reportData.suggestedLegalSections = suggestLegalSections(reportData.abuseType);

        // 3. Find and assign nearest police station
        if (reportData.locationCoordinates && reportData.locationCoordinates.coordinates) {
            const [longitude, latitude] = reportData.locationCoordinates.coordinates;
            try {
                const policeStation = await findNearestPoliceStation(latitude, longitude);
                reportData.assignedPoliceStation = policeStation;
                console.log(`Assigned police station: ${policeStation.name} (${policeStation.distance}km away)`);
            } catch (error) {
                console.error('Failed to find nearest police station:', error);
                // Continue without police station assignment
            }
        }

        // 4. Link to user if authenticated
        if (req.user) {
            reportData.user = req.user.userId;
        }

        const newReport = new WitnessReport(reportData);
        const savedReport = await newReport.save();

        res.status(201).json({
            message: 'Report submitted successfully',
            reportId: savedReport.reportId,
            riskScore: savedReport.riskAssessment.riskScore,
            suggestedLaws: savedReport.suggestedLegalSections,
            evidenceCount: savedReport.evidence?.length || 0,
            assignedPoliceStation: savedReport.assignedPoliceStation
        });
    } catch (err) {
        console.error('Error submitting witness report:', err);
        res.status(500).json({ message: 'Server error while submitting report', error: err.message });
    }
});

// @route   GET api/witness/my-reports
// @desc    Get reports submitted by current user
// @access  Private
router.get('/my-reports', authenticate, async (req, res) => {
    try {
        const reports = await WitnessReport.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching reports' });
    }
});

// @route   GET api/witness/report/:id
// @desc    Get a specific report by ID
// @access  Private
router.get('/report/:id', authenticate, async (req, res) => {
    try {
        const report = await WitnessReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Verify ownership - only block if report belongs to a DIFFERENT user
        // Allows: anonymous reports (no user) OR reports belonging to current user
        if (report.user && report.user.toString() !== req.user.userId.toString()) {
            console.log('Authorization failed:');
            console.log('Report user ID:', report.user.toString());
            console.log('Requesting user ID:', req.user.userId.toString());
            return res.status(403).json({ message: 'Not authorized to view this report' });
        }

        res.json(report);
    } catch (err) {
        console.error('Error fetching report:', err);
        res.status(500).json({ message: 'Server error fetching report' });
    }
});

// @route   PUT api/witness/report/:id
// @desc    Update a witness report
// @access  Private
router.put('/report/:id', authenticate, async (req, res) => {
    try {
        const report = await WitnessReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Verify ownership - user can only update their own reports
        if (report.user && report.user.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this report' });
        }

        // Update fields
        const allowedUpdates = [
            'incidentDescription', 'location', 'dateTime', 'witnessRelationship',
            'severityLevel', 'immediateRisk', 'actionsTaken', 'optionalContact', 'provideContact',
            'locationCoordinates'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                report[field] = req.body[field];
            }
        });

        const updatedReport = await report.save();
        res.json({
            message: 'Report updated successfully',
            report: updatedReport
        });
    } catch (err) {
        console.error('Error updating report:', err);
        res.status(500).json({ message: 'Server error updating report' });
    }
});

// @route   DELETE api/witness/report/:id
// @desc    Delete a witness report
// @access  Private
router.delete('/report/:id', authenticate, async (req, res) => {
    try {
        const report = await WitnessReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Verify ownership - user can only delete their own reports
        if (report.user && report.user.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this report' });
        }

        await WitnessReport.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report deleted successfully' });
    } catch (err) {
        console.error('Error deleting report:', err);
        res.status(500).json({ message: 'Server error deleting report' });
    }
});

module.exports = router;
