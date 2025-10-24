const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { auth, adminRequired } = require('./middleware/middleware');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');
const adminAuthRoutes = require('./routes/adminAuth');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB")) 
  .catch(err => console.error("MongoDB connection failed:", err));

// API Status route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend connected successfully' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CivicWatch API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin-auth', adminAuthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Admin management scripts:
// node checkAdmins.js
// node createAdmin.js 