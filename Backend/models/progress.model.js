const mongoose = require("mongoose")

const ProgressSchema = new mongoose.Schema({
  courseId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Course",
    required : true
  },
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  videoId : {
    type : Number,
    required : true,
    default : 0
  },
  timeStamp : {
    type : Number,
    required : true,
    default : "0"
  }
})

module.exports = mongoose.model("Progress",ProgressSchema)