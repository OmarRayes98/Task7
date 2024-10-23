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

  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    // required: true, ربما لم يتم اختيار الفيديو لاي كورس سينتمي
  },

}, { timestamps: true });



// Create Videos model
const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
