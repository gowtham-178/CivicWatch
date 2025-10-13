const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      address: {
        type: String,
        required: true
      },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    category: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    images: [{
      type: String // URLs to stored images
    }],
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registeruser',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registeruser'
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registeruser'
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    resolutionDetails: {
      resolvedAt: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registeruser'
      },
      notes: String
    }
  },
  { timestamps: true }
);

// Add text index for search functionality
reportSchema.index({ title: 'text', description: 'text', 'location.address': 'text' });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;