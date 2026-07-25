const express = require('express');
const router = express.Router();
const { auth, adminRequired } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getDashboardAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  bulkUpdateUserRoles,
  getAttentionReports,
  bulkUpdateReportStatus
} = require('../controllers/adminController');

router.use(auth, adminRequired);

router.get('/dashboard', asyncHandler(getDashboardAnalytics));
router.get('/users', asyncHandler(getUsers));
router.put('/users/bulk/role', asyncHandler(bulkUpdateUserRoles));
router.put('/users/:id/role', asyncHandler(updateUserRole));
router.delete('/users/:id', asyncHandler(deleteUser));

router.get('/reports/attention', asyncHandler(getAttentionReports));
router.put('/reports/bulk/status', asyncHandler(bulkUpdateReportStatus));

module.exports = router;