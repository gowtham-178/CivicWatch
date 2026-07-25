const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { uploadSingleImage, handleUploadError } = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getReports,
  getMyReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  addComment,
  toggleUpvote
} = require('../controllers/reportController');

router.get('/', asyncHandler(getReports));
router.get('/my-reports', auth, asyncHandler(getMyReports));
router.get('/:id', asyncHandler(getReportById));

router.post('/', auth, uploadSingleImage, handleUploadError, asyncHandler(createReport));
router.put('/:id', auth, asyncHandler(updateReport));
router.delete('/:id', auth, asyncHandler(deleteReport));

router.post('/:id/comments', auth, asyncHandler(addComment));
router.post('/:id/upvote', auth, asyncHandler(toggleUpvote));

module.exports = router;
