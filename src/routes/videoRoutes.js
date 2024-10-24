const express = require('express');
const router = express.Router();
const Video = require("../models/Video");
const verifyJWT = require("../middleware/verifyJWT");
const checkAccessOwner = require("../middleware/checkAccessOwner");
const Course = require('../models/Course');
const Comment = require('../models/Comment');

/*
note: 
we can create many apis for seprations if the front-end need :
like 1- create video without care about course 
     2- api for add or edit video to course 
     3-edit just video without care about course 
     but now :
     try create apis as crud only with all expected conditions
*/

//get all videos from database : no need to verify 
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().populate("comments").populate("course_id");

    res.status(200).json({status:200,data:videos});

  } catch (error) {
    res.status(500).json({ status:500, message: error.message });
  }
});

//post new video , need verify jwt
router.post("/", verifyJWT, async (req, res) => {

  try {


    const video = new Video(req.body);

    await video.save();

    if(req.body?.course_id){
    const course = await Course.findById( req.body?.course_id);

    if (course) {
      course.videos.push(video)
      await course.save();
    }

  }else{
    // nothing because course optional in level of Add Video
  }


    res.status(201).json({status:201, data:video});
  } catch (error) {
    res.status(500).json({status:500, message: error.message });
  }
});

//put new video , need verify jwt and access 
//id of Video

router.put("/:id",verifyJWT,checkAccessOwner(Video,"video"), async (req, res) => {


  try {
    const video_id = req.params?.id ;


    const video = await Video.findByIdAndUpdate(
      video_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    //compare old and new data of course . if diffrent need to add video .
    //and because vide has one course need to delete old vide of that old course
    if (video?.course_id.toString() !==req.model?.course_id.toString()) {

      const course = await Course.findById( video?.course_id);

      //new course
      if (course) {

        course.videos.push(video)
        await course.save();

        const courseHadVideo = await Course.findById( req.model?.course_id);

        if(courseHadVideo){

          course.videos.filter(item => item.toString() !== video._id.toString())
          await course.save();
        }

      }
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

});

router.delete("/:id",verifyJWT,checkAccessOwner(Video,"video"), async (req, res) => {
  try {
    const video_id = req.params?.id ;


    const video = await Video.findByIdAndDelete(video_id);
    // if (!video) {
    //   return res.status(404).json({ message: "Video not found" });
    // }

    if(video?.course_id){
      const course = await Course.findById( video?.course_id);

    course.videos= course.videos.filter(item => item.toString() !== video._id.toString())
    await course.save();

    if(video?.comments.length > 0){
      await Comment.deleteMany({
        video_id: { $in: video?.comments }
      });

    }

    }
    
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
