const mongoose = require('mongoose');

// Define video schema
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  }],

  
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

}, { timestamps: true });



// Create Videos model
const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
