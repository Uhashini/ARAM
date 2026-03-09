const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const WitnessReport = require('../models/WitnessReport');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { findNearestPoliceStation } = require('../utils/policeStationMapper');
const { calculateRiskScore, determineDestinations } = require('../services/routingService');

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

        // Adapt witness data to routing service expected format if needed
        // The routing service expects 'riskAssessment.indicators' but witness report has flat structure
        // We can map it temporarily for calculation
        const routingInput = {
            ...reportData,
            riskAssessment: {
                indicators: {
                    threatToKill: false, // Witness might not know
                    weaponUse: reportData.accused?.hasWeapon === 'yes',
                    suicideThreats: reportData.riskAssessment.hasSuicideThreats
                }
            },
            perpetrator: reportData.accused,
            medical: reportData.medical
        };

        reportData.riskAssessment.riskScore = calculateRiskScore(routingInput);

        // 1.b Determine Destinations (Routing)
        const destinations = determineDestinations(routingInput, reportData.riskAssessment.riskScore);
        reportData.routing = {
            destinations: destinations,
            priorityLevel: (reportData.riskAssessment.riskScore === 'EXTREME' || reportData.riskAssessment.riskScore === 'HIGH') ? 'P1' : 'P2'
        };

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

        // 5. Add initial system log
        reportData.progressLogs = [{
            timestamp: new Date(),
            type: 'system',
            category: 'status_change',
            content: 'Witness report officially submitted and recorded in the system.',
            actorName: 'System'
        }];

        const newReport = new WitnessReport(reportData);
        const savedReport = await newReport.save();

        res.status(201).json({
            message: 'Report submitted successfully',
            reportId: savedReport.reportId,
            riskScore: savedReport.riskAssessment.riskScore,
            suggestedLaws: savedReport.suggestedLegalSections,
            evidenceCount: savedReport.evidence?.length || 0,
            assignedPoliceStation: savedReport.assignedPoliceStation,
            routing: savedReport.routing
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
            'locationCoordinates', 'status'
        ];

        let statusChanged = false;
        let oldStatus = report.status;

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                if (field === 'status' && report[field] !== req.body[field]) {
                    statusChanged = true;
                }
                report[field] = req.body[field];
            }
        });

        if (statusChanged) {
            report.progressLogs.push({
                timestamp: new Date(),
                type: 'system',
                category: 'status_change',
                content: `Report status changed from ${oldStatus} to ${report.status}.`,
                actorId: req.user.userId,
                actorName: req.user.name || 'Staff'
            });
        }

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

// @route   POST api/witness/report/:id/log
// @desc    Add a manual log entry to a witness report
// @access  Private
router.post('/report/:id/log', authenticate, async (req, res) => {
    try {
        const { category, content, type } = req.body;
        const report = await WitnessReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Verify ownership (witness can add logs to their own report)
        if (report.user && report.user.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add logs to this report' });
        }

        const newLog = {
            timestamp: new Date(),
            type: type || 'witness',
            category: category || 'note',
            content: content,
            actorId: req.user.userId,
            actorName: req.user.name || 'Witness'
        };

        report.progressLogs.push(newLog);
        await report.save();

        res.status(201).json({ message: 'Log entry added successfully', log: newLog });
    } catch (err) {
        console.error('Error adding log:', err);
        res.status(500).json({ message: 'Server error while adding log' });
    }
});

// @route   GET api/witness/analytics/summary
// @desc    Get aggregated analytics for witness reports
// @access  Private
router.get('/analytics/summary', authenticate, async (req, res) => {
    try {
        // 1. Abuse Type Distribution
        const abuseTypeStats = await WitnessReport.aggregate([
            { $unwind: '$abuseType' },
            { $group: { _id: '$abuseType', count: { $sum: 1 } } }
        ]);

        // 2. Risk Level Distribution
        const riskLevelStats = await WitnessReport.aggregate([
            { $group: { _id: '$riskAssessment.riskScore', count: { $sum: 1 } } }
        ]);

        // 3. Status Distribution
        const statusStats = await WitnessReport.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // 4. Reports Over Time (Daily - Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const timelineStats = await WitnessReport.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            abuseTypes: abuseTypeStats,
            riskLevels: riskLevelStats,
            statuses: statusStats,
            timeline: timelineStats
        });
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ message: 'Server error while fetching analytics' });
    }
});

// --- NEW SPECIALIZED EXCEL/CSV REPORTS ---

// @route   GET api/witness/reports/export/analytics
// @desc    Export Analytics Summary as CSV
router.get('/reports/export/analytics', authenticate, async (req, res) => {
    try {
        const stats = await WitnessReport.aggregate([
            { $group: { _id: "$abuseType", count: { $sum: 1 }, avgRisk: { $first: "$riskAssessment.riskScore" } } }
        ]);

        let csv = "Abuse Type,Report Count,Sample Risk\n";
        stats.forEach(s => {
            const types = Array.isArray(s._id) ? s._id.join(";") : s._id;
            csv += `"${types}",${s.count},${s.avgRisk || 'N/A'}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=witness_analytics_summary.csv');
        res.status(200).send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Error generating analytics report' });
    }
});

// @route   GET api/witness/reports/export/compliance
// @desc    Export Compliance Audit as CSV
router.get('/reports/export/compliance', authenticate, async (req, res) => {
    try {
        const reports = await WitnessReport.find({}, 'reportId privacyMode reporterMode createdAt consent status');

        let csv = "Report ID,Privacy Mode,Reporter Mode,Date,Consent Given,Status\n";
        reports.forEach(r => {
            csv += `${r.reportId},${r.privacyMode},${r.reporterMode},${r.createdAt.toISOString()},${r.consent?.isInformationTrue ? 'YES' : 'NO'},${r.status}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=compliance_audit_log.csv');
        res.status(200).send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Error generating compliance report' });
    }
});

// @route   GET api/witness/reports/export/risk
// @desc    Export Risk Distribution as CSV
router.get('/reports/export/risk', authenticate, async (req, res) => {
    try {
        const reports = await WitnessReport.find({}, 'reportId location riskAssessment.riskScore routing.priorityLevel');

        let csv = "Report ID,Location,Risk Score,Priority\n";
        reports.forEach(r => {
            const loc = (r.location || "N/A").replace(/,/g, " ");
            csv += `${r.reportId},"${loc}",${r.riskAssessment?.riskScore || 'LOW'},${r.routing?.priorityLevel || 'P3'}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=risk_distribution_report.csv');
        res.status(200).send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Error generating risk report' });
    }
});

// @route   GET api/witness/reports/export/activity
// @desc    Export User Activity (Engagement) as CSV
router.get('/reports/export/activity', authenticate, async (req, res) => {
    try {
        const stats = await WitnessReport.aggregate([
            { $group: { _id: "$user", totalReports: { $sum: 1 }, lastReport: { $max: "$createdAt" } } }
        ]);

        let csv = "User ID,Total Reports submitted,Last Activity Date\n";
        stats.forEach(s => {
            csv += `${s._id || 'Anonymous'},${s.totalReports},${s.lastReport ? s.lastReport.toISOString() : 'N/A'}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=witness_activity_metrics.csv');
        res.status(200).send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Error generating activity report' });
    }
});

module.exports = router;
