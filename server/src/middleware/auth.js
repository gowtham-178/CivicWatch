const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/apiResponse');
const User = require('../models/user');
const Admin = require('../models/admin');

/**
 * Authentication Middleware
 * Extracts and verifies JWT from header, cookie, or query.
 */
const auth = (req, res, next) => {
  const rawToken =
    req.header('Authorization')?.replace('Bearer ', '') ||
    req.cookies?.token ||
    req.query?.token;

  const token = rawToken ? rawToken.trim() : null;

  if (!token || token === 'undefined' || token === 'null') {
    return sendError(res, 'No authentication token provided, authorization denied', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return sendError(res, 'Token is invalid or has expired. Please log out and log in again.', 401);
  }
};

/**
 * Admin Role Check Middleware
 * Verifies that the authenticated user possesses admin privileges.
 */
const adminRequired = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const adminUser = await Admin.findById(req.user.id);
      if (adminUser && adminUser.isActive) {
        return next();
      }
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return sendError(res, 'Admin access required', 403);
    }
    next();
  } catch (err) {
    return sendError(res, 'Server error checking admin privileges', 500);
  }
};

module.exports = {
  auth,
  adminRequired
};
