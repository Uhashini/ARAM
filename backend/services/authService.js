const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  /**
   * Generate JWT access token
   * @param {Object} payload - Token payload
   * @returns {String} JWT token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'ipv-system',
      audience: 'ipv-users'
    });
  }

  /**
   * Generate refresh token
   * @returns {String} Refresh token
   */
  generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'ipv-system',
        audience: 'ipv-users'
      });
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  /**
   * Calculate token expiration date
   * @param {String} expiresIn - Expiration string (e.g., '15m', '7d')
   * @returns {Date} Expiration date
   */
  calculateExpirationDate(expiresIn) {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      throw new Error('Invalid expiration format');
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return new Date(now.getTime() + value * 1000);
      case 'm': return new Date(now.getTime() + value * 60 * 1000);
      case 'h': return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd': return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default: throw new Error('Invalid time unit');
    }
  }

  /**
   * Authenticate user and create session
   * @param {Object} credentials - User credentials
   * @param {String} ipAddress - Client IP address
   * @param {String} userAgent - Client user agent
   * @returns {Object} Authentication result
   */
  async login(credentials, ipAddress, userAgent) {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact administrator.');
    }

    try {
      // Compare password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await user.incLoginAttempts();
        throw new Error('Invalid email or password');
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await user.resetLoginAttempts();
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Create token payload
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        permissions: user.getRolePermissions()
      };

      // Generate tokens
      const accessToken = this.generateAccessToken(tokenPayload);
      const refreshToken = this.generateRefreshToken();

      // Calculate expiration dates
      const accessTokenExpires = this.calculateExpirationDate(this.jwtExpiresIn);
      const refreshTokenExpires = this.calculateExpirationDate(this.refreshTokenExpiresIn);

      // Create session
      const session = new Session({
        userId: user._id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: refreshTokenExpires, // Session expires with refresh token
        ipAddress: ipAddress,
        userAgent: userAgent
      });

      await session.save();

      return {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
          permissions: user.getRolePermissions()
        },
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          accessTokenExpires: accessTokenExpires,
          refreshTokenExpires: refreshTokenExpires
        },
        sessionId: session._id
      };

    } catch (error) {
      // Increment login attempts for any authentication error
      if (user && error.message.includes('Invalid email or password')) {
        await user.incLoginAttempts();
      }
      throw error;
    }
  }

  /**
   * Logout user and deactivate session
   * @param {String} token - Access token
   * @returns {Object} Logout result
   */
  async logout(token) {
    try {
      // Find and deactivate session
      const session = await Session.findActiveByToken(token);
      if (session) {
        await session.deactivate();
      }

      return {
        success: true,
        message: 'Successfully logged out'
      };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {String} refreshToken - Refresh token
   * @param {String} ipAddress - Client IP address
   * @param {String} userAgent - Client user agent
   * @returns {Object} New tokens
   */
  async refreshToken(refreshToken, ipAddress, userAgent) {
    try {
      // Find active session by refresh token
      const session = await Session.findActiveByRefreshToken(refreshToken);
      if (!session) {
        throw new Error('Invalid or expired refresh token');
      }

      const user = session.userId;
      if (!user || !user.isActive) {
        throw new Error('User account is not active');
      }

      // Create new token payload
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        permissions: user.getRolePermissions()
      };

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(tokenPayload);
      const newRefreshToken = this.generateRefreshToken();

      // Calculate new expiration dates
      const accessTokenExpires = this.calculateExpirationDate(this.jwtExpiresIn);
      const refreshTokenExpires = this.calculateExpirationDate(this.refreshTokenExpiresIn);

      // Update session with new tokens
      session.token = newAccessToken;
      session.refreshToken = newRefreshToken;
      session.expiresAt = refreshTokenExpires;
      session.ipAddress = ipAddress;
      session.userAgent = userAgent;
      session.lastActivity = new Date();

      await session.save();

      return {
        success: true,
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          accessTokenExpires: accessTokenExpires,
          refreshTokenExpires: refreshTokenExpires
        }
      };

    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Validate access token and return user context
   * @param {String} token - Access token to validate
   * @returns {Object} User context
   */
  async validateToken(token) {
    try {
      // Verify JWT token
      const decoded = this.verifyAccessToken(token);

      // Find active session
      const session = await Session.findActiveByToken(token);
      if (!session) {
        throw new Error('Session not found or expired');
      }

      // Update session activity
      await session.updateActivity();

      const user = session.userId;
      if (!user || !user.isActive) {
        throw new Error('User account is not active');
      }

      return {
        userId: user._id,
        email: user.email,
        role: user.role,
        permissions: user.getRolePermissions(),
        sessionId: session._id,
        profile: user.profile
      };

    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  /**
   * Logout all user sessions
   * @param {String} userId - User ID
   * @returns {Object} Logout result
   */
  async logoutAllSessions(userId) {
    try {
      await Session.deactivateUserSessions(userId);
      return {
        success: true,
        message: 'All sessions logged out successfully'
      };
    } catch (error) {
      throw new Error(`Logout all sessions failed: ${error.message}`);
    }
  }

  /**
   * Clean up expired sessions (should be run periodically)
   * @returns {Object} Cleanup result
   */
  async cleanupExpiredSessions() {
    try {
      const result = await Session.cleanupExpired();
      return {
        success: true,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      throw new Error(`Session cleanup failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();