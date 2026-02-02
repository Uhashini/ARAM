/**
 * Advanced authorization middleware for role-based access control (RBAC)
 * Provides fine-grained permission checking for the IPV intervention system
 */

/**
 * Role-based route protection middleware
 * @param {Array|String} allowedRoles - Roles that can access the route
 * @param {Object} options - Additional options for authorization
 */
const requireRole = (allowedRoles, options = {}) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication is required to access this resource',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userRole = req.user.role;

    // Check if user has required role
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_ROLE',
          message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${userRole}`,
          timestamp: new Date().toISOString(),
          requestId: req.id,
          supportActions: [
            'Contact your administrator to request appropriate access',
            'Verify you are logged in with the correct account'
          ]
        }
      });
    }

    // Additional role-specific checks
    if (options.requireActive !== false && req.user.isActive === false) {
      return res.status(403).json({
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account is inactive. Please contact administrator.',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    next();
  };
};

/**
 * Permission-based access control middleware
 * @param {Array|String} requiredPermissions - Permissions required to access the route
 * @param {String} operator - 'AND' (all permissions required) or 'OR' (any permission required)
 */
const requirePermission = (requiredPermissions, operator = 'AND') => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication is required to access this resource',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const userPermissions = req.user.permissions || [];

    let hasAccess = false;

    if (operator === 'OR') {
      // User needs at least one of the required permissions
      hasAccess = permissions.some(permission => userPermissions.includes(permission));
    } else {
      // User needs all required permissions (AND)
      hasAccess = permissions.every(permission => userPermissions.includes(permission));
    }

    if (!hasAccess) {
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `Access denied. Required permission(s): ${permissions.join(operator === 'OR' ? ' OR ' : ' AND ')}`,
          timestamp: new Date().toISOString(),
          requestId: req.id,
          supportActions: [
            'Contact your administrator to request appropriate permissions',
            'Verify you are logged in with the correct account'
          ]
        }
      });
    }

    next();
  };
};

/**
 * Resource ownership verification middleware
 * Ensures users can only access resources they own or have permission to access
 * @param {String} resourceType - Type of resource being accessed
 * @param {String} ownerField - Field name that contains the owner ID (default: 'userId')
 */
const requireOwnership = (resourceType, ownerField = 'userId') => {
  return async (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication is required to access this resource',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Admin users can access all resources
    if (req.user.role === 'admin') {
      return next();
    }

    // Healthcare workers can access patient-related resources
    if (req.user.role === 'healthcare_worker' && 
        ['patient', 'screening', 'careplan', 'referral'].includes(resourceType)) {
      return next();
    }

    try {
      const resourceId = req.params.id || req.params.resourceId;
      
      if (!resourceId) {
        return res.status(400).json({
          error: {
            code: 'RESOURCE_ID_REQUIRED',
            message: 'Resource ID is required for ownership verification',
            timestamp: new Date().toISOString(),
            requestId: req.id
          }
        });
      }

      // Get the appropriate model based on resource type
      const Model = getModelByResourceType(resourceType);
      if (!Model) {
        return res.status(500).json({
          error: {
            code: 'INVALID_RESOURCE_TYPE',
            message: 'Invalid resource type specified',
            timestamp: new Date().toISOString(),
            requestId: req.id
          }
        });
      }

      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: `${resourceType} not found`,
            timestamp: new Date().toISOString(),
            requestId: req.id
          }
        });
      }

      // Check ownership
      const ownerId = resource[ownerField]?.toString();
      const userId = req.user.userId?.toString();

      if (ownerId !== userId) {
        return res.status(403).json({
          error: {
            code: 'RESOURCE_ACCESS_DENIED',
            message: `You do not have permission to access this ${resourceType}`,
            timestamp: new Date().toISOString(),
            requestId: req.id,
            supportActions: [
              'Verify you are accessing the correct resource',
              'Contact support if you believe this is an error'
            ]
          }
        });
      }

      // Store resource in request for use in route handler
      req.resource = resource;
      next();

    } catch (error) {
      console.error('Ownership verification error:', error);
      return res.status(500).json({
        error: {
          code: 'OWNERSHIP_VERIFICATION_ERROR',
          message: 'Error verifying resource ownership',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }
  };
};

/**
 * Helper function to get the appropriate Mongoose model based on resource type
 * @param {String} resourceType - Type of resource
 * @returns {Object} Mongoose model
 */
const getModelByResourceType = (resourceType) => {
  const mongoose = require('mongoose');
  
  const modelMap = {
    'user': mongoose.model('User'),
    'witness_report': mongoose.model('WitnessReport'),
    'victim_profile': mongoose.model('VictimProfile'),
    'screening': mongoose.model('Screening'),
    'safety_plan': mongoose.model('SafetyPlan'),
    'journal_entry': mongoose.model('JournalEntry'),
    'patient': mongoose.model('Patient'),
    'clinical_screening': mongoose.model('ClinicalScreening'),
    'careplan': mongoose.model('Careplan'),
    'referral': mongoose.model('Referral')
  };

  return modelMap[resourceType];
};

/**
 * Middleware to check if user has access to specific patient data
 * Healthcare workers can only access patients in their department/facility
 */
const requirePatientAccess = () => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication is required to access patient data',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Admin users can access all patient data
    if (req.user.role === 'admin') {
      return next();
    }

    // Only healthcare workers can access patient data
    if (req.user.role !== 'healthcare_worker') {
      return res.status(403).json({
        error: {
          code: 'HEALTHCARE_ACCESS_REQUIRED',
          message: 'Healthcare worker access required for patient data',
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Additional checks can be added here for department/facility restrictions
    // For now, all healthcare workers can access all patient data
    next();
  };
};

/**
 * Middleware to ensure anonymous reporting remains anonymous
 * Prevents collection of identifying information in witness reports
 */
const enforceAnonymity = () => {
  return (req, res, next) => {
    if (req.body) {
      // Remove any potentially identifying fields from anonymous reports
      const identifyingFields = [
        'email', 'phone', 'firstName', 'lastName', 'name',
        'address', 'ssn', 'patientId', 'userId'
      ];

      const removeIdentifyingInfo = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            if (identifyingFields.includes(key.toLowerCase())) {
              delete obj[key];
            } else if (typeof obj[key] === 'object') {
              removeIdentifyingInfo(obj[key]);
            }
          }
        }
      };

      // Only enforce for anonymous witness reports
      if (req.path.includes('/witness/anonymous') || req.body.isAnonymous) {
        removeIdentifyingInfo(req.body);
      }
    }

    next();
  };
};

/**
 * Audit logging middleware for sensitive operations
 * Logs access to sensitive resources for compliance
 */
const auditLog = (operation, resourceType) => {
  return (req, res, next) => {
    const auditData = {
      userId: req.user?.userId,
      userRole: req.user?.role,
      operation,
      resourceType,
      resourceId: req.params.id || req.params.resourceId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      requestId: req.id
    };

    // Log the audit entry (implement your logging solution here)
    console.log('AUDIT LOG:', JSON.stringify(auditData));

    // Store audit data in request for potential use in route handlers
    req.auditData = auditData;

    next();
  };
};

/**
 * Rate limiting middleware for sensitive operations
 * Prevents abuse of critical endpoints
 */
const rateLimitSensitive = () => {
  const attempts = new Map();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_ATTEMPTS = 10; // Max attempts per window

  return (req, res, next) => {
    const key = `${req.ip}-${req.user?.userId || 'anonymous'}`;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + WINDOW_MS });
      return next();
    }

    const userAttempts = attempts.get(key);
    
    if (now > userAttempts.resetTime) {
      // Reset window
      attempts.set(key, { count: 1, resetTime: now + WINDOW_MS });
      return next();
    }

    if (userAttempts.count >= MAX_ATTEMPTS) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          timestamp: new Date().toISOString(),
          requestId: req.id,
          retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000)
        }
      });
    }

    userAttempts.count++;
    next();
  };
};

module.exports = {
  requireRole,
  requirePermission,
  requireOwnership,
  requirePatientAccess,
  enforceAnonymity,
  auditLog,
  rateLimitSensitive
};