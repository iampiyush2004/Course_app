const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { password } = require('./admin.model');

const AdminSchema = new mongoose.Schema({
  name: String,
  age: String,
  experience: Number,
  gender : String,
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

// AdminSchema.pre("save", async (req,res,next) => {
//   if(!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password,10)
//   return next()
// })

AdminSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(this.password,password)
}

AdminSchema.methods.generateToken = async function() {
  return jwt.sign({
    _id: this._id.toString(),
    username: this.username
  }, process.env.JWT_SECRET);
}

module.exports = mongoose.model('Admin', AdminSchema);