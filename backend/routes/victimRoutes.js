const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const VictimReport = require('../models/VictimReport');
const { authenticate, optionalAuth } = require('../middleware/auth');
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime', 'application/pdf', 'audio/mpeg', 'audio/wav'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, videos, audio, and PDFs are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: fileFilter
});

// @route   POST api/victim/report
// @desc    Submit a comprehensive victim report
// @access  Public (Optional Auth)
router.post('/report', optionalAuth, upload.array('evidence', 10), async (req, res) => {
    try {
        // Parse the reportData from FormData
        let reportData = req.body.reportData ? JSON.parse(req.body.reportData) : req.body;

        // Process uploaded evidence files
        if (req.files && req.files.length > 0) {
            const evidence = req.files.map(file => ({
                fileType: file.mimetype,
                fileUrl: file.path, // In a real app, this would be a cloud URL
                fileHash: 'SHA256-PLACEHOLDER-' + Date.now(), // In real app, compute hash
                uploadedAt: new Date()
            }));

            if (!reportData.evidence) reportData.evidence = [];
            reportData.evidence = [...reportData.evidence, ...evidence];
        }

        // 1. Calculate Risk Score
        const riskScore = calculateRiskScore(reportData);
        if (!reportData.riskAssessment) reportData.riskAssessment = {};
        reportData.riskAssessment.score = riskScore;

        // 2. Determine Routing
        const destinations = determineDestinations(reportData, riskScore);
        reportData.routing = {
            destinations: destinations,
            priorityLevel: (riskScore === 'EXTREME' || riskScore === 'HIGH') ? 'P1' : 'P2'
        };

        // 3. Link to user if authenticated
        if (req.user) {
            reportData.user = req.user.userId;
        }

        const newReport = new VictimReport(reportData);
        const savedReport = await newReport.save();

        res.status(201).json({
            message: 'Report submitted successfully',
            reportId: savedReport.reportId,
            riskScore: savedReport.riskAssessment.score,
            routing: savedReport.routing,
            status: savedReport.status
        });
    } catch (err) {
        console.error('Error submitting victim report:', err);
        res.status(500).json({ message: 'Server error while submitting report', error: err.message });
    }
});

// @route   GET api/victim/emergency-contacts
// @desc    Get the authenticated user's emergency contacts
// @access  Private
router.get('/emergency-contacts', authenticate, async (req, res) => {
    try {
        const VictimProfile = require('../models/VictimProfile');
        const profile = await VictimProfile.findOne({ userId: req.user.userId }).select('emergencyContacts');
        if (!profile) {
            return res.json({ contacts: [] }); // new users start with empty list
        }
        res.json({ contacts: profile.emergencyContacts || [] });
    } catch (err) {
        console.error('Error fetching emergency contacts:', err);
        res.status(500).json({ message: 'Server error fetching contacts' });
    }
});

// @route   PUT api/victim/emergency-contacts
// @desc    Replace the emergency contacts list for the authenticated user
// @access  Private
router.put('/emergency-contacts', authenticate, async (req, res) => {
    try {
        const VictimProfile = require('../models/VictimProfile');
        const { contacts } = req.body;

        if (!Array.isArray(contacts)) {
            return res.status(400).json({ message: 'contacts must be an array' });
        }

        // Validate each contact has required fields
        for (const c of contacts) {
            if (!c.name || !c.phone || !c.relationship) {
                return res.status(400).json({ message: 'Each contact requires name, phone, and relationship' });
            }
        }

        // Upsert the profile (create if doesn't exist)
        const profile = await VictimProfile.findOneAndUpdate(
            { userId: req.user.userId },
            { $set: { emergencyContacts: contacts } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({
            message: 'Emergency contacts updated',
            contacts: profile.emergencyContacts
        });
    } catch (err) {
        console.error('Error updating emergency contacts:', err);
        res.status(500).json({ message: 'Server error updating contacts', error: err.message });
    }
});

module.exports = router;
