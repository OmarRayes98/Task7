const express = require('express');
const router = express.Router();
const Comment = require("../models/Comment");
const verifyJWT = require("../middleware/verifyJWT");
const checkAccessOwner = require("../middleware/checkAccessOwner");
const Video = require('../models/Video');

//get all Comments from database : no need to verify 
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().populate("video_id").populate({path:"user_id",select: { password: 0 }});

    res.status(200).json({status:200,data:comments});

  } catch (error) {
    res.status(500).json({ status:500, message: error.message });
  }
});

//post new video , need verify jwt
//id of Comment
router.post("/", verifyJWT, async (req, res) => {

  try {
    const vidoe = await Video.findById(req.body?.video_id);

    if (!vidoe) {
      return res.status(404).json({status:404, message: "Video not found" });
    }

    const comment = new Comment(req.body);

    await comment.save();

    vidoe.comments.push(comment)
    await vidoe.save();


    res.status(201).json({status:201, data:comment});
  } catch (error) {
    res.status(500).json({status:500, message: error.message });
  }
});

//:id of comment
router.put("/:id",verifyJWT,checkAccessOwner(Comment,"comment"), async (req, res) => {


  try {

    const comment_id = req.params?.id

    const comment = await Comment.findByIdAndUpdate(
      comment_id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

});

router.delete("/:id",verifyJWT,checkAccessOwner(Comment,"comment"), async (req, res) => {
  try {
    const comment_id = req.params?.id ;

    const comment = await Video.findByIdAndDelete(comment_id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
