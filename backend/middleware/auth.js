const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { code: 'MISSING_TOKEN', message: 'Access token is required' }
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both id and userId in payload for compatibility
    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Set user context
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token validation failed: ' + error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const userId = decoded.id || decoded.userId;
      const user = await User.findById(userId);

      if (user) {
        req.user = {
          userId: user._id,
          email: user.email,
          role: user.role
        };
        req.token = token;
      }
    }
    next();
  } catch (error) {
    console.warn('Optional authentication failed:', error.message);
    next();
  }
};

/**
 * Middleware to require specific user roles
 * Must be used after authenticate middleware
 * @param {Array|String} roles - Required roles (string or array of strings)
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication is required',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_ROLE',
          message: `Access denied. Required role(s): ${requiredRoles.join(', ')}`,
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    next();
  };
};

/**
 * Middleware to require specific permissions
 * Must be used after authenticate middleware
 * @param {Array|String} permissions - Required permissions
 */
const requirePermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication is required',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    const userPermissions = req.user.permissions || [];

    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Access denied. Required permission(s): ${requiredPermissions.join(', ')}`,
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    next();
  };
};

/**
 * Middleware to require resource ownership
 * Checks if the authenticated user owns the requested resource
 * @param {String} resourceIdParam - Request parameter containing resource ID
 * @param {String} ownerField - Field name that contains the owner ID (default: 'userId')
 */
const requireOwnership = (resourceIdParam, ownerField = 'userId') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication is required',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    const resourceId = req.params[resourceIdParam];
    if (!resourceId) {
      return res.status(400).json({
        error: {
          code: 'MISSING_RESOURCE_ID',
          message: `Resource ID parameter '${resourceIdParam}' is required`,
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // For now, we'll implement basic ownership check
    // This can be extended to check specific models based on resource type
    if (resourceId !== req.user.userId.toString()) {
      // Allow admins and healthcare workers to access patient data
      const allowedRoles = ['admin', 'healthcare_worker'];
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only access your own resources',
            timestamp: new Date().toISOString(),
            requestId: req.id
          }
        });
      }
    }

    next();
  };
};

/**
 * Middleware to add request ID for tracking
 */
const addRequestId = (req, res, next) => {
  req.id = require('crypto').randomUUID();
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requirePermission,
  requireOwnership,
  addRequestId
};