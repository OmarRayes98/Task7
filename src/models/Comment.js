const mongoose = require('mongoose');

// Define comment schema
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,

  },


}, { timestamps: true });



// Create comments model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
