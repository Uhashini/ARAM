const express = require('express');
const router = express.Router();
const { authenticate, addRequestId } = require('../middleware/auth');
const {
  requireRole,
  requirePermission,
  auditLog,
  rateLimitSensitive
} = require('../middleware/authorization');

const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Content = require('../models/Content');
const SystemReport = require('../models/SystemReport');
const WitnessReport = require('../models/WitnessReport');
const VictimReport = require('../models/VictimReport');

// Add request ID to all admin routes
router.use(addRequestId);

// All admin routes require authentication
router.use(authenticate);

// All admin routes require admin role
router.use(requireRole('admin'));

// @route   GET /api/admin/analytics/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/analytics/dashboard', auditLog('READ', 'dashboard'), async (req, res) => {
  try {
    const { country, state, district } = req.query;

    const witnessFilter = {};
    const victimFilter = {};

    if (country) {
      witnessFilter['region.country'] = country;
      victimFilter['personalDetails.region.country'] = country;
    }
    if (state) {
      witnessFilter['region.state'] = state;
      victimFilter['personalDetails.region.state'] = state;
    }
    if (district) {
      witnessFilter['region.district'] = district;
      victimFilter['personalDetails.region.district'] = district;
    }

    const totalUsers = await User.countDocuments();
    const totalWitnessReports = await WitnessReport.countDocuments(witnessFilter);
    const totalVictimReports = await VictimReport.countDocuments(victimFilter);

    // Calculate risk distribution
    const highRisk = await VictimReport.countDocuments({ ...victimFilter, 'riskAssessment.score': 'HIGH' });
    const extremeRisk = await VictimReport.countDocuments({ ...victimFilter, 'riskAssessment.score': 'EXTREME' });
    const mediumRisk = await VictimReport.countDocuments({ ...victimFilter, 'riskAssessment.score': 'MEDIUM' });
    const lowRisk = await VictimReport.countDocuments({ ...victimFilter, 'riskAssessment.score': 'LOW' });

    // Calculate active referrals
    const activeReferralsCount = await VictimReport.countDocuments({
      ...victimFilter,
      'routing.assignedAgencies': { $elemMatch: { status: { $ne: 'closed' } } }
    });

    // Calculate system uptime
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (24 * 3600));
    const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
    const systemUptime = `${days}d ${hours}h`;

    // Trends for last 6 months
    const trends = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });

      const witnessCount = await WitnessReport.countDocuments({
        ...witnessFilter,
        createdAt: { $gte: monthDate, $lt: nextMonthDate }
      });
      const victimCount = await VictimReport.countDocuments({
        ...victimFilter,
        createdAt: { $gte: monthDate, $lt: nextMonthDate }
      });

      trends.push({ month: monthName, reports: witnessCount + victimCount });
    }

    res.json({
      stats: {
        totalUsers,
        totalReports: totalWitnessReports + totalVictimReports,
        activeReferrals: activeReferralsCount,
        systemUptime
      },
      riskDistribution: {
        EXTREME: extremeRisk,
        HIGH: highRisk,
        MEDIUM: mediumRisk,
        LOW: lowRisk
      },
      trends
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get users list
// @access  Private (Admin only)
router.get('/users', auditLog('READ', 'user'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', auditLog('UPDATE', 'user'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role', error: err.message });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user by admin
// @access  Private (Admin only)
router.post('/users', auditLog('CREATE', 'user'), async (req, res) => {
  try {
    const { name, email, password, role, organization } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role, organization });
    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', auditLog('DELETE', 'user'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

// @route   GET /api/admin/reports
// @desc    Get generated reports list
// @access  Private (Admin only)
router.get('/reports', auditLog('READ', 'report'), async (req, res) => {
  try {
    const reports = await SystemReport.find().sort({ createdAt: -1 });
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message });
  }
});

// @route   POST /api/admin/reports
// @desc    Generate system reports
// @access  Private (Admin only)
router.post('/reports', auditLog('CREATE', 'report'), async (req, res) => {
  try {
    const { title, type, format, filters } = req.body;
    const newReport = new SystemReport({
      title,
      type,
      format,
      filters,
      generatedBy: { userId: req.user.userId, name: req.user.name },
      fileUrl: `/uploads/reports/temp-${Date.now()}.pdf` // Mock URL
    });
    await newReport.save();
    res.status(201).json({ report: newReport });
  } catch (err) {
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
});

// @route   GET /api/admin/content
// @desc    Get content list
// @access  Private (Admin only)
router.get('/content', auditLog('READ', 'content'), async (req, res) => {
  try {
    const content = await Content.find().sort({ createdAt: -1 });
    res.json({ content });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching content', error: err.message });
  }
});

// @route   POST /api/admin/content
// @desc    Create content
// @access  Private (Admin only)
router.post('/content', auditLog('CREATE', 'content'), async (req, res) => {
  try {
    const contentData = req.body;
    contentData.metadata = { ...contentData.metadata, author: req.user.userId };
    const newContent = new Content(contentData);
    await newContent.save();
    res.status(201).json({ content: newContent });
  } catch (err) {
    res.status(500).json({ message: 'Error creating content', error: err.message });
  }
});

// @route   PUT /api/admin/content/:id
// @desc    Update specific content
// @access  Private (Admin only)
router.put('/content/:id', auditLog('UPDATE', 'content'), async (req, res) => {
  try {
    const updatedContent = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ content: updatedContent });
  } catch (err) {
    res.status(500).json({ message: 'Error updating content', error: err.message });
  }
});

// @route   DELETE /api/admin/content/:id
// @desc    Delete specific content
// @access  Private (Admin only)
router.delete('/content/:id', auditLog('DELETE', 'content'), async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting content', error: err.message });
  }
});

const Notification = require('../models/Notification');

// ... (existing analytics, users, reports, content routes) ...

// @route   GET /api/admin/notifications
// @desc    Get system notifications
// @access  Private (Admin only)
router.get('/notifications', auditLog('READ', 'notification'), async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// @route   DELETE /api/admin/notifications/:id
// @desc    Delete notification
// @access  Private (Admin only)
router.delete('/notifications/:id', auditLog('DELETE', 'notification'), async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
});

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin only)
router.get('/settings', auditLog('READ', 'settings'), async (req, res) => {
  try {
    // Current mocked settings (would ideally be in a model)
    const settings = {
      systemMode: 'Standard',
      registrationAllowed: true,
      maintenanceMode: false,
      alertThreshold: 80,
      regionRestriction: 'Delhi/NCR',
      auditRetentionDays: 90
    };
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings', error: err.message });
  }
});

// @route   POST /api/admin/settings
// @desc    Update system settings
// @access  Private (Admin only)
router.post('/settings', auditLog('UPDATE', 'settings'), async (req, res) => {
  try {
    // In a real app, you would save this to a Settings model
    res.json({ message: 'Settings updated successfully', settings: req.body });
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

module.exports = router;