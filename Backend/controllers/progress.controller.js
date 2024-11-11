const Progress = require("../models/progress.model")
const User = require("../models/user.model")
const updateProgress = async(req,res) => {
  const userId = req.user?._id
  if(!userId) {
    return res.status(401).json({message : "Unauthorized Access"})
  } 
  const courseId = req.params.courseId
  if(!courseId) {
    return res.status(400).json({message : "Course Id is not provided"})
  }
  try {
    const {videoId,timeStamp} = req.body
    const progress = await Progress.findOneAndUpdate(
      {
        userId,
        courseId
      },
      {
        $set : {
          videoId,
          timeStamp
        }
      },
      {new : true, upsert: true}
    )
    if(!progress){
      return res.status(500).json({message: "Internal Server Error in updating progress"})
    }
    await User.findOneAndUpdate({_id:userId},{
      $set:{lastWatched:courseId}
    },
    { upsert: true }
    )
    // console.log("hi")
    return res.status(200).json({
      message : "Updated Progess Successfully",
      progress
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const getProgress = async(req,res) => {
  const userId = req.user?._id
  if(!userId) {
    return res.status(401).json({message : "Unauthorized Access"})
  } 
  const courseId = req.params.courseId
  if(!courseId) {
    return res.status(400).json({message : "Course Id is not provided"})
  }
  try {
    const progress = await Progress.findOne({courseId,userId})
    if(!progress){
      return res.status(500).json({message: "Internal Server Error in fetching progress"})
    }
    return res.status(200).json({
      message : "Progess Fetched Successfully",
      progress
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

module.exports = {updateProgress,getProgress}