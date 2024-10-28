const mongoose = require('mongoose');

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

module.exports = mongoose.model('Admin', AdminSchema);