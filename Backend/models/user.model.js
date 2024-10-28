const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
  userName : {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    index: true
  },
  email : {
    type : String,
    required : true,
    unique : true,
    lowercase : true
  },
  fullName : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true,
  },
  dob : {
    type : String,
    required : true
  },
  gender : {
    type : String,
    enum : ['male','femal','others']
  },
  avatar: {
    type: String, 
    required: true,
  },
  institution : {
    type : String,
  },
  bio : {
    type : String,
    default : ""
  },
  courseCreated : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Course"
  }],
  coursePurchased : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Course"
  }]
})

UserSchema.pre("save",async(next) => {
  if(!modified(this.password)) return next()
  this.password = await bcrypt.hash(this.password, 10)
  return next()
})

UserSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(this.password,password)
}

UserSchema.methods.generateToken = async function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,   
    },
    process.env.JWT_SECRET,
  )
}

module.exports = mongoose.model("User",UserSchema)