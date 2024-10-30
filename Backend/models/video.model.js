const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        // required: true
    },
    thumbnail: {
        type: String,
        // required: true
    },
    createdBy: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", 
        required: true 
    },
    title: {
        type: String,
        // required: true,
        index: true
    },
    description: {
        type: String,
        // required: true
    },
    duration: {
        type: Number,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    belongsTo: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);
