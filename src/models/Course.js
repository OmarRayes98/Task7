const mongoose = require('mongoose');

// Define course schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  duration: { 
    type: String,
    required: true
 },

 user_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
videos: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Video",
}],

}, { timestamps: true });



// Create courses model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
