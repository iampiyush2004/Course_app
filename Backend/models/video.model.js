const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoFile:{
    type : String,
    //required : true
  },
  thumbnail:{
    type : String,
    //required : true
  },
  owner:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  title:{
    type : String,
    //required : true,
    index : true
  },
  description : {
    type : String,
   // required : true
  },
  duration : {
    type : Number,
    
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

module.exports = mongoose.model("Video",videoSchema)