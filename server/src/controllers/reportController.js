const Report = require('../models/report');
const Comment = require('../models/comment');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Get all public reports (supports search, category, status, priority filters, pagination)
 */
const getReports = async (req, res) => {
  const { category, status, priority, search, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (search) {
    filter.$text = { $search: search };
  }

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const reports = await Report.find(filter)
    .populate('submittedBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .skip((parsedPage - 1) * parsedLimit)
    .limit(parsedLimit);

  const total = await Report.countDocuments(filter);

  return res.json({
    success: true,
    data: {
      docs: reports,
      totalDocs: total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      hasNextPage: parsedPage < Math.ceil(total / parsedLimit),
      hasPrevPage: parsedPage > 1
    }
  });
};

/**
 * Get logged-in user's reports
 */
const getMyReports = async (req, res) => {
  const reports = await Report.find({ submittedBy: req.user.id })
    .populate('submittedBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  return sendSuccess(res, reports);
};

/**
 * Get single report by ID with comments
 */
const getReportById = async (req, res) => {
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
    return sendError(res, 'Report not found', 404);
  }

  return sendSuccess(res, report);
};

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

const categorizeWithRAG = async (title, description, location) => {
  try {
    const response = await fetch(`${RAG_SERVICE_URL}/api/categorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, location: location || '' })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.categories && data.categories.length > 0 && !data.categories.every(c => c === 'General')) {
        return {
          category: data.categories,
          priority: data.priority || 'Medium'
        };
      }
    }
  } catch (err) {
    console.error('RAG auto-categorization microservice offline, using intelligent keyword classifier:', err.message);
  }

  // Intelligent Keyword Classifier (Fallback when RAG microservice is unreachable)
  const fullText = `${title} ${description}`.toLowerCase();
  
  let category = ['General'];
  let priority = 'Medium';

  if (/(trash|waste|garbage|bin|litter|dump|recycling|foul odor|smell|sanitation|cleanliness)/i.test(fullText)) {
    category = ['Waste Management'];
  } else if (/(pothole|road|street|infrastructure|asphalt|sidewalk|bridge|crack|lane|highway|pavement)/i.test(fullText)) {
    category = ['Infrastructure Repair'];
    if (/(hazard|danger|deep|night|accident|cyclist|motorcycle|damage)/i.test(fullText)) {
      priority = 'High';
    }
  } else if (/(water|pipe|leak|sewage|drain|overflow|flood|burst)/i.test(fullText)) {
    category = ['Water Supply'];
  } else if (/(light|lamp|dark|electric|power|wire|pole|streetlight)/i.test(fullText)) {
    category = ['Street Lighting'];
  } else if (/(traffic|signal|vehicle|parking|collision|pedestrian|speed)/i.test(fullText)) {
    category = ['Traffic & Safety'];
  }

  return { category, priority };
};

/**
 * Create a new report
 */
const createReport = async (req, res) => {
  const { title, description, location, latitude, longitude, lat, lng } = req.body;

  if (!title || !description || !location) {
    return sendError(res, 'Missing required fields: title, description, location', 400);
  }

  // RAG Microservice Auto-Categorization
  const ragResult = await categorizeWithRAG(title, description, location);
  const autoCategory = ragResult.category;
  const autoPriority = ragResult.priority;

  const reportLat = latitude || lat;
  const reportLng = longitude || lng;
  const coordinates = reportLat && reportLng ? { lat: Number(reportLat), lng: Number(reportLng) } : undefined;

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const newReport = new Report({
    title,
    description,
    location: {
      address: location,
      ...(coordinates && { coordinates })
    },
    category: autoCategory,
    priority: autoPriority,
    images: imageUrl ? [imageUrl] : [],
    submittedBy: req.user.id
  });

  await newReport.save();
  await newReport.populate('submittedBy', 'name email');

  return sendSuccess(res, newReport, 'Report created successfully', 201);
};

/**
 * Update report details or status
 */
const updateReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return sendError(res, 'Report not found', 404);
  }

  const submittedById = report.submittedBy
    ? (report.submittedBy._id ? report.submittedBy._id.toString() : report.submittedBy.toString())
    : null;
  const currentUserId = req.user && (req.user.id || req.user._id)
    ? (req.user.id || req.user._id).toString()
    : null;
  const isOwner = submittedById && currentUserId && submittedById === currentUserId;
  const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'Admin' || !!req.user.username);

  if (!isOwner && !isAdmin) {
    return sendError(res, 'Not authorized to update this report', 403);
  }

  const { title, description, address, lat, lng, category, priority, status, resolutionNotes } = req.body;

  // Status Lock: Resolved reports cannot have their status modified
  if (report.status === 'Resolved' && status && status !== 'Resolved') {
    return sendError(res, 'This report has been resolved and its status cannot be modified.', 400);
  }

  if (title) report.title = title;
  if (description) report.description = description;
  if (address) report.location.address = address;
  if (lat && lng) report.location.coordinates = { lat, lng };

  if (category) {
    let categoryArray = [];
    if (Array.isArray(category)) {
      categoryArray = category;
    } else if (typeof category === 'string') {
      try {
        const parsed = JSON.parse(category);
        categoryArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        categoryArray = category.split(',').map((c) => c.trim()).filter(Boolean);
      }
    }
    if (categoryArray.length > 0) {
      report.category = categoryArray;
    }
  }

  if (priority) report.priority = priority;

  if (status) {
    if (!isAdmin) {
      return sendError(res, 'Only administrators are authorized to modify report status', 403);
    }
    if (status === 'Resolved' && report.status !== 'Resolved') {
      report.resolutionDetails = {
        resolvedAt: new Date(),
        resolvedBy: req.user ? (req.user.id || req.user._id) : null,
        notes: resolutionNotes || 'Resolved by official action'
      };
    }
    report.status = status;
  }

  await report.save();
  return sendSuccess(res, { report }, 'Report updated successfully');
};

/**
 * Delete a report
 */
const deleteReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return sendError(res, 'Report not found', 404);
  }

  const submittedById = report.submittedBy
    ? (report.submittedBy._id ? report.submittedBy._id.toString() : report.submittedBy.toString())
    : null;
  const currentUserId = req.user && (req.user.id || req.user._id)
    ? (req.user.id || req.user._id).toString()
    : null;
  const isOwner = submittedById && currentUserId && submittedById === currentUserId;
  const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'Admin' || !!req.user.username);

  if (!isOwner && !isAdmin) {
    return sendError(res, 'Not authorized to delete this report', 403);
  }

  await Comment.deleteMany({ report: req.params.id });
  await Report.findByIdAndDelete(req.params.id);

  return sendSuccess(res, null, 'Report deleted successfully');
};

/**
 * Add a comment to a report
 */
const addComment = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return sendError(res, 'Report not found', 404);
  }

  const { text } = req.body;
  if (!text || !text.trim()) {
    return sendError(res, 'Comment text is required', 400);
  }

  const newComment = new Comment({
    text: text.trim(),
    report: req.params.id,
    author: req.user.id,
    isOfficial: req.user.role === 'admin'
  });

  await newComment.save();
  report.comments.push(newComment._id);
  await report.save();
  await newComment.populate('author', 'name email');

  return sendSuccess(res, { comment: newComment }, 'Comment added successfully', 201);
};

/**
 * Toggle Upvote on a report
 */
const toggleUpvote = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return sendError(res, 'Report not found', 404);
  }

  const userIndex = report.upvotes.findIndex((id) => id.toString() === req.user.id);
  let isUpvoted = false;
  if (userIndex > -1) {
    report.upvotes.splice(userIndex, 1);
  } else {
    report.upvotes.push(req.user.id);
    isUpvoted = true;
  }

  await report.save();
  return sendSuccess(res, { upvotes: report.upvotes.length, upvotesList: report.upvotes, isUpvoted });
};

module.exports = {
  getReports,
  getMyReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  addComment,
  toggleUpvote
};
