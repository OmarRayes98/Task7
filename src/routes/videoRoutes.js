const express = require('express');
const router = express.Router();
const Video = require("../models/Video");
const verifyJWT = require("../middleware/verifyJWT");
const checkAccessOwner = require("../middleware/checkAccessOwner");
const Course = require('../models/Course');


//get all videos from database : no need to verify 
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().populate("comments");

    res.status(200).json({status:200,data:videos});

  } catch (error) {
    res.status(500).json({ status:500, message: error.message });
  }
});

//post new video , need verify jwt
//id of Course
router.post("/:id", verifyJWT, async (req, res) => {

  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({status:404, message: "Course not found" });
    }

    const video = new Video(req.body);

    await video.save();

    course.videos.push(video)
    await course.save();


    res.status(201).json({status:201, data:video});
  } catch (error) {
    res.status(500).json({status:500, message: error.message });
  }
});

//put new video , need verify jwt and access 
//id of Course

//checkAccessOwner(Course,"video") . Course Model contains user_id (The Owner of course and videos)
router.put("/:id",verifyJWT,checkAccessOwner(Video,"video"), async (req, res) => {


  try {
    const video_id = req.params?.video_id ;



    const video = await Video.findByIdAndUpdate(
      video_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!video) {
      return res.status(404).json({ message: "Vidoe not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

});

router.delete("/:id",verifyJWT,checkAccessOwner(Video,"video"), async (req, res) => {
  try {
    const video_id = req.params?.video_id ;

    // Validate video_id
    // if (!video_id) {
    //   return res.status(400).send('Invalid video ID');
    // }

    const video = await Video.findByIdAndDelete(video_id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;