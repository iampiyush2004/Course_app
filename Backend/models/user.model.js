const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
 name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others']
  },
  avatar: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
  },
  coursePurchased: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  lastWatched : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Course"
  }
});

//Hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


UserSchema.methods.generateToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET
  );
};

module.exports = mongoose.model("User", UserSchema);
