const authService = require('../services/authService');

/**
 * Authentication middleware to verify JWT tokens
 * Adds user context to req.user if token is valid
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'MISSING_TOKEN',
          message: 'Access token is required',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate token and get user context
    const userContext = await authService.validateToken(token);

    // Add user context to request
    req.user = userContext;
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);

    // Determine appropriate error response
    let statusCode = 401;
    let errorCode = 'INVALID_TOKEN';
    let message = 'Invalid or expired token';

    if (error.message.includes('expired')) {
      errorCode = 'TOKEN_EXPIRED';
      message = 'Token has expired';
    } else if (error.message.includes('Session not found')) {
      errorCode = 'SESSION_EXPIRED';
      message = 'Session has expired';
    } else if (error.message.includes('User account is not active')) {
      errorCode = 'ACCOUNT_INACTIVE';
      message = 'User account is not active';
    }

    return res.status(statusCode).json({
      error: {
        code: errorCode,
        message: message,
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    });
  }
};

/**
 * Optional authentication middleware
 * Adds user context if token is present and valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userContext = await authService.validateToken(token);
      req.user = userContext;
      req.token = token;
    }
    next();
  } catch (error) {
    // For optional auth, we don't return an error, just continue without user context
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