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
            'severityLevel', 'immediateRisk', 'actionsTaken', 'optionalContact', 'provideContact'
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
