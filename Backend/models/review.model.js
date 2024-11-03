const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
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
  comment : {
    type : String,
    required : true
  },
  stars : {
    type : Number,
    default : 0,
    enum : [1,2,3,4,5]
  }
})

module.exports = mongoose.model("Review",reviewSchema)