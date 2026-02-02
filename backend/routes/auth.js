const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const User = require('../models/User');
const { authenticate, addRequestId } = require('../middleware/auth');
const { 
  loginSchema, 
  registerSchema, 
  refreshTokenSchema, 
  changePasswordSchema, 
  updateProfileSchema,
  validate 
} = require('../validation/authValidation');

// Add request ID to all auth routes
router.use(addRequestId);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email already exists',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Create new user
    const userData = {
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      role,
      profile
    };

    const user = await User.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));

      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'User registration validation failed',
          details: validationErrors,
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    res.status(500).json({
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'User registration failed',
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';

    const result = await authService.login(
      { email, password },
      ipAddress,
      userAgent
    );

    res.status(200).json({
      ...result,
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Login error:', error);

    // Determine appropriate status code
    let statusCode = 401;
    let errorCode = 'LOGIN_FAILED';

    if (error.message.includes('Account is temporarily locked')) {
      statusCode = 423; // Locked
      errorCode = 'ACCOUNT_LOCKED';
    } else if (error.message.includes('Account is deactivated')) {
      statusCode = 403; // Forbidden
      errorCode = 'ACCOUNT_DEACTIVATED';
    }

    res.status(statusCode).json({
      error: {
        code: errorCode,
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
  try {
    const result = await authService.logout(req.token);

    res.status(200).json({
      ...result,
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Logout error:', error);

    res.status(500).json({
      error: {
        code: 'LOGOUT_FAILED',
        message: 'Logout failed',
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   POST /api/auth/logout-all
// @desc    Logout all user sessions
// @access  Private
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    const result = await authService.logoutAllSessions(req.user.userId);

    res.status(200).json({
      ...result,
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Logout all error:', error);

    res.status(500).json({
      error: {
        code: 'LOGOUT_ALL_FAILED',
        message: 'Logout all sessions failed',
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Public
router.post('/refresh', validate(refreshTokenSchema), async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'Unknown';

    const result = await authService.refreshToken(refreshToken, ipAddress, userAgent);

    res.status(200).json({
      ...result,
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Token refresh error:', error);

    res.status(401).json({
      error: {
        code: 'TOKEN_REFRESH_FAILED',
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        permissions: user.getRolePermissions(),
        isActive: user.isActive,
        lastLogin: user.lastLogin
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Failed to fetch user profile',
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, validate(updateProfileSchema), async (req, res) => {
  try {
    const { profile } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Update profile fields
    Object.keys(profile).forEach(key => {
      if (profile[key] !== undefined) {
        user.profile[key] = profile[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Profile update error:', error);

    res.status(500).json({
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'Failed to update profile',
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticate, validate(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CURRENT_PASSWORD',
          message: 'Current password is incorrect',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    // Logout all other sessions for security
    await authService.logoutAllSessions(user._id);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. All sessions have been logged out.',
      timestamp: new Date().toISOString(),
      requestId: req.id
    });

  } catch (error) {
    console.error('Password change error:', error);

    res.status(500).json({
      error: {
        code: 'PASSWORD_CHANGE_FAILED',
        message: 'Failed to change password',
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
});

// @route   POST /api/auth/validate
// @desc    Validate current token
// @access  Private
router.post('/validate', authenticate, (req, res) => {
  // If we reach here, the token is valid (authenticate middleware passed)
  res.status(200).json({
    success: true,
    valid: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions
    },
    timestamp: new Date().toISOString(),
    requestId: req.id
  });
});

module.exports = router;