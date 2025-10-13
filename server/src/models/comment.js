const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registeruser',
      required: true
    },
    isOfficial: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;