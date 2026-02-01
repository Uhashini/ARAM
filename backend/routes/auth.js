const express = require('express');
const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Authentication endpoints will be implemented in task 2.1'
    }
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Authentication endpoints will be implemented in task 2.1'
    }
  });
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Public
router.post('/refresh', (req, res) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Authentication endpoints will be implemented in task 2.1'
    }
  });
});

module.exports = router;