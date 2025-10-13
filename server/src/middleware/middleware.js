const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

// Authentication middleware
const auth = (req, res, next) => {
  // Get token from header, cookies, or query string
  const token = 
    req.header('Authorization')?.replace('Bearer ', '') || 
    req.cookies?.token ||
    req.query?.token;
    
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'No authentication token, authorization denied' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      error: 'Token is not valid or has expired' 
    });
  }
};

// Admin role check middleware
const adminRequired = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Admin access required' 
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error checking admin status' 
    });
  }
};

module.exports = { auth, adminRequired };
