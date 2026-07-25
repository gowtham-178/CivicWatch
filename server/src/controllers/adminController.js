const Report = require('../models/report');
const User = require('../models/user');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Get Admin Dashboard analytics
 */
const getDashboardAnalytics = async (req, res) => {
  const statusCounts = await Report.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const categoryCounts = await Report.aggregate([
    { $unwind: '$category' },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  const priorityCounts = await Report.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentReports = await Report.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const userCount = await User.countDocuments();

  return sendSuccess(res, {
    statusCounts,
    categoryCounts,
    priorityCounts,
    recentReports,
    userCount
  });
};

/**
 * Get paginated list of users (Admin only)
 */
const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find().select('-password').skip(skip).limit(limit);
  const total = await User.countDocuments();

  return sendSuccess(res, { users, total, page, pages: Math.ceil(total / limit) });
};

/**
 * Update single user role
 */
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!role || !['admin', 'user'].includes(role)) {
    return sendError(res, 'Invalid role. Role must be admin or user', 400);
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  return sendSuccess(res, user, 'User role updated successfully');
};

/**
 * Delete single user account
 */
const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return sendError(res, 'User not found', 404);
  }
  return sendSuccess(res, null, 'User deleted successfully');
};

/**
 * Bulk update user roles
 */
const bulkUpdateUserRoles = async (req, res) => {
  const { userIds, role } = req.body;

  if (!userIds || !Array.isArray(userIds) || !role || !['admin', 'user'].includes(role)) {
    return sendError(res, 'Invalid request data', 400);
  }

  await User.updateMany({ _id: { $in: userIds } }, { role });
  return sendSuccess(res, null, `Successfully updated ${userIds.length} users`);
};

/**
 * Get pending high priority reports requiring attention
 */
const getAttentionReports = async (req, res) => {
  const reports = await Report.find({
    $or: [
      { status: 'Pending', priority: { $in: ['High', 'Critical'] } },
      { status: 'In Progress', updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    ]
  })
    .populate('submittedBy', 'name email')
    .sort({ priority: -1, createdAt: -1 });

  return sendSuccess(res, reports);
};

/**
 * Bulk update report status
 */
const bulkUpdateReportStatus = async (req, res) => {
  const { reportIds, status } = req.body;

  if (!reportIds || !Array.isArray(reportIds) || !status) {
    return sendError(res, 'Invalid request data', 400);
  }

  const updateFields = { $set: { status } };
  if (status === 'Resolved') {
    updateFields.$set.resolutionDetails = {
      resolvedAt: new Date(),
      resolvedBy: req.user.id,
      notes: 'Bulk resolved by admin'
    };
  }

  await Report.updateMany({ _id: { $in: reportIds } }, updateFields);
  return sendSuccess(res, null, `Successfully updated ${reportIds.length} reports`);
};

module.exports = {
  getDashboardAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  bulkUpdateUserRoles,
  getAttentionReports,
  bulkUpdateReportStatus
};
