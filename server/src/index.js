const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { globalErrorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');
const adminAuthRoutes = require('./routes/adminAuth');

const app = express();

// Enable CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static uploaded files
app.use('/uploads', express.static(uploadsDir));

// Connect to Database
connectDB();

// Health Check Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend connected successfully' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CivicWatch API' });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin-auth', adminAuthRoutes);

// Global Error Handler Middleware
app.use(globalErrorHandler);

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`CivicWatch Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;