const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://iampiyush2004:YnnM6IeExRLcQBo0@cluster0.u7ws2.mongodb.net/course_selling_app');

// Define schemas
const AdminSchema = new mongoose.Schema({
    name: String,
    age: String,
    experience: Number,
    gender : String,
    company: String,
    bio: String,
    avatar: String,
    username: String,
    password: String,
    createdCourses: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Course'
    }]
 });
 
  

const UserSchema = new mongoose.Schema({
    name: String,
    dob: String,
    
    gender : String,
    institution : String,
   
    avatar: String,
    username: String,
    password: String,
    email: String,
    
    purchasedCourses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    }]
} ,{timestamps : true});

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

const ReviewSchema = new mongoose.Schema({
    comment : String,
    star : Number
})


const videoSchema = new mongoose.Schema({
    videoFile:{
      type : String,
      required : true
    },
    thumbnail:{
      type : String,
      required : true
    },
    owner:{
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    },
    title:{
      type : String,
      required : true,
      index : true
    },
    description : {
      type : String,
      required : true
    },
    duration : {
      type : Number,
      required : true
    },
    views : {
      type : Number,
      default : 0
    },
    isPublished : {
      type : Boolean,
      default : true
    }
  },{timestamps:true})
  


const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
const Review = mongoose.model('Review' , ReviewSchema );
const Video = mongoose.model('Video' , videoSchema);

module.exports = {
    Admin,
    User,
    Course,
    Review,
    Video
}