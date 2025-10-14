const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const router = express.Router();

// POST /api/create-admin (Use this carefully - maybe add authentication)
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }
    
    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Admin with this username or email already exists'
      });
    }
    
    // Create admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      email,
      password: hashedPassword
    });
    
    await admin.save();
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;