const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: String,
  description : String,
  bio : String,
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
  }],
  totalStars: Number,
  totalReviews : Number,
  tags: [String]
});

module.exports = mongoose.model("Course",CourseSchema)


