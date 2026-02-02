const express = require('express');
const router = express.Router();
const WitnessReport = require('../models/WitnessReport');
const { authenticate, optionalAuth } = require('../middleware/auth');

// @route   POST api/witness/report
// @desc    Submit a witness report (anonymous or authenticated)
// @access  Public (Optional Auth)
router.post('/report', optionalAuth, async (req, res) => {
    try {
        const reportData = { ...req.body };

        // Link to user if authenticated
        if (req.user) {
            reportData.user = req.user.userId;
        }

        const newReport = new WitnessReport(reportData);
        const savedReport = await newReport.save();

        res.status(201).json({
            message: 'Report submitted successfully',
            reportId: savedReport._id
        });
    } catch (err) {
        console.error('Error submitting witness report:', err);
        res.status(500).json({ message: 'Server error while submitting report' });
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

module.exports = router;
