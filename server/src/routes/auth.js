const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { auth } = require('../middleware/middleware');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

// Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, address, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: 'user' // Default role
    });

    await user.save();
    
    // Create token payload
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Generate JWT token
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        
        // Return user data without password
        const userData = user.toObject();
        delete userData.password;
        
        res.status(201).json({ 
          success: true, 
          token, 
          user: userData
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Create token payload
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Generate JWT token
    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
      (err, token) => {
        if (err) throw err;
        
        // Return user data without password
        const userData = user.toObject();
        delete userData.password;
        
        res.status(200).json({ 
          success: true, 
          token, 
          user: userData
        });
      }
    );
  } catch (err) { 
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get current user profile
router.get('/myprofile', auth, async (req, res) => {
  try {
    // Find user by ID from token
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;