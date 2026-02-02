const express = require('express');
const router = express.Router();
const WitnessReport = require('../models/WitnessReport');

// @route   POST api/witness/report
// @desc    Submit an anonymous witness report
// @access  Public
router.post('/report', async (req, res) => {
    try {
        const {
            incidentDescription,
            location,
            dateTime,
            witnessRelationship,
            severityLevel,
            immediateRisk,
            actionsTaken,
            optionalContact,
            provideContact
        } = req.body;

        const newReport = new WitnessReport({
            incidentDescription,
            location,
            dateTime,
            witnessRelationship,
            severityLevel,
            immediateRisk,
            actionsTaken,
            optionalContact: provideContact ? optionalContact : {},
            provideContact
        });

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

module.exports = router;
