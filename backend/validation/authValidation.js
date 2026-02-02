const Joi = require('joi');

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    })
});

// User registration validation schema
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    }),
  role: Joi.string()
    .valid('witness', 'victim', 'healthcare_worker', 'admin')
    .required()
    .messages({
      'any.only': 'Role must be one of: witness, victim, healthcare_worker, admin',
      'any.required': 'User role is required'
    }),
  profile: Joi.object({
    firstName: Joi.string()
      .trim()
      .max(50)
      .required()
      .messages({
        'string.max': 'First name cannot exceed 50 characters',
        'any.required': 'First name is required'
      }),
    lastName: Joi.string()
      .trim()
      .max(50)
      .required()
      .messages({
        'string.max': 'Last name cannot exceed 50 characters',
        'any.required': 'Last name is required'
      }),
    phone: Joi.string()
      .pattern(new RegExp('^\\+?[\\d\\s\\-\\(\\)]+$'))
      .allow('')
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    department: Joi.string()
      .trim()
      .max(100)
      .when('role', {
        is: 'healthcare_worker',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'string.max': 'Department name cannot exceed 100 characters',
        'any.required': 'Department is required for healthcare workers'
      }),
    licenseNumber: Joi.string()
      .trim()
      .max(50)
      .when('role', {
        is: 'healthcare_worker',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'string.max': 'License number cannot exceed 50 characters',
        'any.required': 'License number is required for healthcare workers'
      })
  }).required()
});

// Refresh token validation schema
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token is required'
    })
});

// Change password validation schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required'
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters long',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'New passwords do not match',
      'any.required': 'New password confirmation is required'
    })
});

// Update profile validation schema
const updateProfileSchema = Joi.object({
  profile: Joi.object({
    firstName: Joi.string()
      .trim()
      .max(50)
      .messages({
        'string.max': 'First name cannot exceed 50 characters'
      }),
    lastName: Joi.string()
      .trim()
      .max(50)
      .messages({
        'string.max': 'Last name cannot exceed 50 characters'
      }),
    phone: Joi.string()
      .pattern(new RegExp('^\\+?[\\d\\s\\-\\(\\)]+$'))
      .allow('')
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    department: Joi.string()
      .trim()
      .max(100)
      .messages({
        'string.max': 'Department name cannot exceed 100 characters'
      }),
    licenseNumber: Joi.string()
      .trim()
      .max(50)
      .messages({
        'string.max': 'License number cannot exceed 50 characters'
      })
  }).min(1).required().messages({
    'object.min': 'At least one profile field must be provided'
  })
});

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, params, query)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: validationErrors,
          timestamp: new Date().toISOString(),
          requestId: req.id
        }
      });
    }

    // Replace request property with validated and sanitized value
    req[property] = value;
    next();
  };
};

module.exports = {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
  validate
};