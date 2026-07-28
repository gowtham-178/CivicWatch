const bcrypt = require('bcrypt');
const User = require('../models/user');
const Admin = require('../models/admin');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { generateToken } = require('../utils/jwt');
const { generateOtp, sendOtpEmail } = require('../utils/otp');

/**
 * Register a new user
 */
const registerUser = async (req, res) => {
  const { name, email, password, phone, emailOrPhone, confirmpassword } = req.body;

  if (!name || !password || !confirmpassword) {
    return sendError(res, 'Name, password, and confirm password are required', 400);
  }

  if (password !== confirmpassword) {
    return sendError(res, 'Passwords do not match', 400);
  }

  if (password.trim().length < 6) {
    return sendError(res, 'Password must be at least 6 characters long', 400);
  }

  let targetEmail = email ? email.trim() : null;
  let targetPhone = phone ? phone.trim() : null;


  if (!targetEmail) {
    return sendError(res, 'Email is required', 400);
  }

  if (targetEmail) {
    const existingUser = await User.findOne({ email: targetEmail.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'Email already registered', 400);
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const user = new User({
    name,
    email: targetEmail ? targetEmail.toLowerCase() : undefined,
    phone: targetPhone || undefined,
    password: hashedPassword,
    role: 'user',
    isEmailVerified: false,
    emailOtp: otp,
    otpExpiry
  });

  await user.save();

  const emailSent = await sendOtpEmail(targetEmail, otp);
  if (!emailSent) {
    return sendError(res, 'Failed to send OTP verification code', 500);
  }

  return sendSuccess(
    res,
    { email: targetEmail },
    'Registration successful. OTP sent for verification.',
    201
  );
};

/**
 * Verify Email OTP
 */
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendError(res, 'Email and OTP are required', 400);
  }

  const targetIdentifier = email.trim();
  const user = await User.findOne({
    $or: [
      { email: targetIdentifier.toLowerCase() },
      { phone: targetIdentifier }
    ]
  });

  if (!user) {
    return sendError(res, 'User account not found', 404);
  }

  if (user.isEmailVerified) {
    return sendError(res, 'Account is already verified', 400);
  }

  if (!user.otpExpiry || new Date() > user.otpExpiry) {
    return sendError(res, 'OTP has expired. Please request a new code.', 400);
  }

  if (user.emailOtp !== otp.trim()) {
    return sendError(res, 'Invalid OTP passcode', 400);
  }

  user.isEmailVerified = true;
  user.emailOtp = null;
  user.otpExpiry = null;
  await user.save();

  const token = generateToken(user.id, user.role);
  const userData = user.toObject();
  delete userData.password;

  return sendSuccess(res, { token, user: userData }, 'OTP verified successfully');
};

/**
 * Resend OTP
 */
const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendError(res, 'Email is required', 400);
  }

  const targetIdentifier = email.trim();
  const user = await User.findOne({
    $or: [
      { email: targetIdentifier.toLowerCase() },
      { phone: targetIdentifier }
    ]
  });

  if (!user) {
    return sendError(res, 'User account not found', 404);
  }

  if (user.isEmailVerified) {
    return sendError(res, 'Account is already verified', 400);
  }

  const otp = generateOtp();
  user.emailOtp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const emailSent = await sendOtpEmail(user.email, otp);
  if (!emailSent) {
    return sendError(res, 'Failed to send OTP code', 500);
  }

  return sendSuccess(res, { email: user.email }, 'OTP resent successfully');
};

/**
 * User & Admin Login
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password required', 400);
  }

  const targetIdentifier = email.trim();

  // 1. Check Admin collection first
  const admin = await Admin.findOne({
    $or: [
      { username: targetIdentifier },
      { email: targetIdentifier.toLowerCase() }
    ],
    isActive: true
  });

  if (admin) {
    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const token = generateToken(admin._id, 'admin');
      const adminData = {
        _id: admin._id,
        id: admin._id,
        name: admin.username,
        username: admin.username,
        email: admin.email,
        role: 'admin'
      };
      return sendSuccess(res, { token, user: adminData }, 'Admin login successful');
    }
  }

  // 2. Check User collection
  const user = await User.findOne({
    $or: [
      { email: targetIdentifier.toLowerCase() },
      { phone: targetIdentifier }
    ]
  });

  if (!user) {
    return sendError(res, 'Invalid credentials', 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendError(res, 'Invalid credentials', 400);
  }

  if (!user.isEmailVerified) {
    // Generate new OTP for unverified user on login attempt
    const otp = generateOtp();
    user.emailOtp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOtpEmail(user.email, otp);

    return res.status(400).json({
      success: false,
      error: 'Account not verified. A fresh OTP code has been sent to your email.',
      requiresOtp: true,
      email: user.email
    });
  }

  const token = generateToken(user.id, user.role);
  const userData = user.toObject();
  delete userData.password;
  userData.id = userData._id;

  return sendSuccess(res, { token, user: userData }, 'Login successful');
};

/**
 * Get current profile details
 */
const getMyProfile = async (req, res) => {
  if (req.user && req.user.role === 'admin') {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (admin) {
      return sendSuccess(res, {
        _id: admin._id,
        id: admin._id,
        name: admin.username,
        username: admin.username,
        email: admin.email,
        role: 'admin'
      });
    }

    const userAdmin = await User.findById(req.user.id).select('-password');
    if (userAdmin) {
      const adminData = userAdmin.toObject();
      adminData.id = adminData._id;
      adminData.role = 'admin';
      return sendSuccess(res, adminData);
    }

    return sendError(res, 'Admin account not found', 404);
  }

  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return sendError(res, 'User account not found', 404);
  }
  const userData = user.toObject();
  userData.id = userData._id;
  return sendSuccess(res, userData);
};

/**
 * Update current user profile
 */
const updateMyProfile = async (req, res) => {
  const { name, phone } = req.body;

  if (!name) {
    return sendError(res, 'Name is required', 400);
  }

  if (req.user && req.user.role === 'admin') {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }
    admin.username = name;
    await admin.save();

    return sendSuccess(res, {
      id: admin._id,
      name: admin.username,
      username: admin.username,
      email: admin.email,
      role: 'admin'
    }, 'Profile updated successfully');
  }

  const updateFields = { name };
  const unsetFields = {};
  const targetPhone = phone ? phone.trim() : null;

  if (targetPhone) {
    updateFields.phone = targetPhone;
  } else {
    unsetFields.phone = 1;
  }

  const updateObj = { $set: updateFields };
  if (Object.keys(unsetFields).length > 0) {
    updateObj.$unset = unsetFields;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateObj, { new: true, runValidators: true }).select('-password');
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  return sendSuccess(res, user, 'Profile updated successfully');
};

/**
 * Change Password
 */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return sendError(res, 'All password fields are required', 400);
  }

  if (newPassword !== confirmPassword) {
    return sendError(res, 'Passwords do not match', 400);
  }

  if (newPassword.trim().length < 6) {
    return sendError(res, 'New password must be at least 6 characters long', 400);
  }

  const AccountModel = (req.user && req.user.role === 'admin') ? Admin : User;
  const account = await AccountModel.findById(req.user.id);

  if (!account) {
    return sendError(res, 'Account not found', 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, account.password);
  if (!isMatch) {
    return sendError(res, 'Current password is incorrect', 400);
  }

  const salt = await bcrypt.genSalt(10);
  account.password = await bcrypt.hash(newPassword, salt);
  await account.save();

  return sendSuccess(res, null, 'Password changed successfully');
};

module.exports = {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  getMyProfile,
  updateMyProfile,
  changePassword
};
