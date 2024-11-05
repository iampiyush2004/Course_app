const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  name: String,
  age: String,
  experience: Number,
  gender: String,
  company: String,
  bio: String,
  avatar: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdCourses: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Course'
  }]
});

// Hash password before saving if it has been modified
AdminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare provided password with hashed password
AdminSchema.methods.isPasswordCorrect = async function(passwordd) {
  return await bcrypt.compare(passwordd, this.password);
};

// Generate JWT for authentication
AdminSchema.methods.generateToken = function() {
  return jwt.sign({
    _id: this._id.toString(),
    username: this.username
  }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('Admin', AdminSchema);
