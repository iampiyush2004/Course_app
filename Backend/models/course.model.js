const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: String,
  description : String,
  imageLink : String, 
  price : Number,
  isCompleted : Boolean,
  usersEnrolled : Number,
  category : String,
  teacher : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Admin'
  },
  reviews : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Review'
  }],
  videos : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Video'
  }]
});

module.exports = mongoose.model("Course",CourseSchema)