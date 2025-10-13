const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const Comment = require('../models/comment');
const { auth } = require('../middleware/middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// Get all reports (with filtering options)
router.get('/', async (req, res) => {
  try {
    const { category, status, priority, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Text search if provided
    if (search) {
      filter.$text = { $search: search };
    }
    
    const reports = await Report.find(filter)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
      
    const total = await Report.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        docs: reports,
        totalDocs: total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get reports submitted by the logged-in user
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ submittedBy: req.user.id })
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get a single report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name email'
        }
      });
      
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create a new report
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, category, priority } = req.body;
    
    // Process uploaded image
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newReport = new Report({
      title,
      description,
      location: {
        address: location
      },
      category,
      priority: priority || 'Medium',
      images: imageUrl ? [imageUrl] : [],
      submittedBy: req.user.id
    });
    
    await newReport.save();
    await newReport.populate('submittedBy', 'name email');
    
    res.status(201).json({ success: true, data: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update a report
router.put('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    
    // Check if user is the owner or an admin
    if (report.submittedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this report' });
    }
    
    const { title, description, address, lat, lng, category, priority, status } = req.body;
    
    // Update fields
    if (title) report.title = title;
    if (description) report.description = description;
    if (address) report.location.address = address;
    if (lat && lng) report.location.coordinates = { lat, lng };
    if (category) report.category = category;
    if (priority) report.priority = priority;
    
    // Only admins can update status
    if (status && req.user.role === 'admin') {
      report.status = status;
      
      // If status is changed to resolved, add resolution details
      if (status === 'Resolved' && report.status !== 'Resolved') {
        report.resolutionDetails = {
          resolvedAt: new Date(),
          resolvedBy: req.user.id,
          notes: req.body.resolutionNotes || ''
        };
      }
    }
    
    await report.save();
    res.json({ success: true, report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete a report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    
    // Check if user is the owner or an admin
    if (report.submittedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this report' });
    }
    
    // Delete associated comments
    await Comment.deleteMany({ report: req.params.id });
    
    // Delete the report
    await Report.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add a comment to a report
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    
    const { text } = req.body;
    
    const newComment = new Comment({
      text,
      report: req.params.id,
      author: req.user.id,
      isOfficial: req.user.role === 'admin'
    });
    
    await newComment.save();
    
    // Add comment to report's comments array
    report.comments.push(newComment._id);
    await report.save();
    
    // Populate author details
    await newComment.populate('author', 'name email');
    
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Upvote a report
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    
    // Check if user already upvoted
    if (report.upvotes.includes(req.user.id)) {
      // Remove upvote (toggle)
      report.upvotes = report.upvotes.filter(id => id.toString() !== req.user.id);
    } else {
      // Add upvote
      report.upvotes.push(req.user.id);
    }
    
    await report.save();
    res.json({ success: true, upvotes: report.upvotes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;