const express = require('express');
const router = express.Router();
const Course = require("../models/Course");
const verifyJWT = require("../middleware/verifyJWT");
const checkAccessOwner = require("../middleware/checkAccessOwner");
const Video = require('../models/Video');
// const validationFormatClass = require('../utils/validationFormat'); // Adjust path as necessary


//get all courses from database : no need to verify 
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate({path:"user_id",select: { password: 0 }}).populate("videos");

    res.status(200).json({status:200,data:courses});

  } catch (error) {
    res.status(500).json({ status:500, message: error.message });
  }
});

//get  course by id from database : no need to verify 
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate({path:"user_id",select: { password: 0 }}).populate("videos");
    if (!course) {
      return res.status(404).json({ status:404, message: "Course not found" });
    }
    res.status(200).json({data:course});
  } catch (error) {
    res.status(500).json({status:500, message: error.message });
  }
});

//post new course , need verify jwt
router.post("/", verifyJWT, async (req, res) => {

  try {

    // if (!validationFormatClass.isValidDuration(req.body?.duration)) {
    //   return res.status(400).json({status:400, message: "bad request ,Duration must be in 'hh:mm:ss' format." });
    // }

    const course = new Course(req.body);

    await course.save();

    res.status(201).json({status:201, data:course});
  } catch (error) {
    res.status(500).json({status:500, message: error.message });
  }
});

//put existed course , need verify jwt
router.put("/:id", verifyJWT,checkAccessOwner(Course,"course"), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Course by ID (DELETE)
router.delete("/:id",verifyJWT,checkAccessOwner(Course,"course"), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // delete the couse_id from database that relate to Video Model : so the Video will not belon to any course any more
    
    if(course?.videos.length > 0){
      await Video.deleteMany({
        course_id: { $in: course.videos }
      });
      res.status(200).json({ message: "Course deleted successfully ,\nwarning the videos were reltated to this course does not have course any more" });

    }else{
      res.status(200).json({ message: "Course deleted successfully "});

    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
