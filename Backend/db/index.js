const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://iampiyush2004:YnnM6IeExRLcQBo0@cluster0.u7ws2.mongodb.net/course_selling_app');

// Define schemas
const AdminSchema = new mongoose.Schema({
    name: String,
    age: Number,
    experience: Number,
    gender : String,
    company: String,
    username: String,
    password: String,
    
    createdCourses: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Course'
    }]
 });
 
  

const UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    purchasedCourses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description : String,
    imageLink : String, 
    price : Number
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}