const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const User = require('../models/user');
const { auth, adminRequired } = require('../middleware/middleware');

// Admin routes below

// Get dashboard analytics
router.get('/dashboard', auth, adminRequired, async (req, res) => {
  try {
    // Get counts by status
    const statusCounts = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get counts by category
    const categoryCounts = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get counts by priority
    const priorityCounts = await Report.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Get reports created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentReports = await Report.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get total users count
    const userCount = await User.countDocuments();
    
    res.json({
      statusCounts,
      categoryCounts,
      priorityCounts,
      recentReports,
      userCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', auth, adminRequired, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find().select('-password').skip(skip).limit(limit);
    const total = await User.countDocuments();
    
    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', auth, adminRequired, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be admin or user' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, adminRequired, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Bulk update user roles (admin only)
router.put('/users/bulk/role', auth, adminRequired, async (req, res) => {
  try {
    const { userIds, role } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || !role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid data' });
    }
    
    await User.updateMany({ _id: { $in: userIds } }, { role });
    res.json({ success: true, message: `Updated ${userIds.length} users` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get reports that need attention (pending, high priority)
router.get('/reports/attention', auth, adminRequired, async (req, res) => {
  try {
    const reports = await Report.find({
      $or: [
        { status: 'Pending', priority: { $in: ['High', 'Critical'] } },
        { status: 'In Progress', updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
      ]
    })
    .populate('submittedBy', 'name email')
    .sort({ priority: -1, createdAt: -1 });
    
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Bulk update report status (admin only)
router.put('/reports/bulk/status', auth, adminRequired, async (req, res) => {
  try {
    const { reportIds, status } = req.body;
    
    if (!reportIds || !Array.isArray(reportIds) || !status) {
      return res.status(400).json({ success: false, error: 'Invalid data' });
    }
    
    await Report.updateMany({ _id: { $in: reportIds } }, { status, updatedAt: new Date() });
    res.json({ success: true, message: `Updated ${reportIds.length} reports` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;