const express = require('express');
const router = express.Router();

// @route   POST /api/witness/report
// @desc    Submit anonymous witness report
// @access  Public
router.post('/report', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Witness reporting endpoints will be implemented in task 4.1'
    }
  });
});

// @route   GET /api/witness/confirmation/:reportId
// @desc    Get report confirmation details
// @access  Public
router.get('/confirmation/:reportId', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Witness reporting endpoints will be implemented in task 4.5'
    }
  });
});

module.exports = router;