const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  changePassword
} = require('../controllers/authController');

router.post('/signup', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

router.get('/myprofile', auth, asyncHandler(getMyProfile));
router.put('/myprofile', auth, asyncHandler(updateMyProfile));
router.post('/change-password', auth, asyncHandler(changePassword));

module.exports = router;
