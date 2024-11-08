const Course = require("../models/course.model") 
const Admin = require("../models/admin.model") 
const Video = require('../models/video.model');
const mongoose = require('mongoose');

const viewAllCourses = async (req, res) => {
 
  const response = await Course.find({})
  res.json({courses : response})

}

const deleteCourse = async (req, res) => {
  const adminId = req.admin?._id
  if(!adminId) {
    return res.status(401).json({
      "message" : "Unauthorized Access!!!"
    })
  }

  try {
      const courseId = req.params.courseId;
     
      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ message: "Course not found." });
      }
      
      await Admin.findByIdAndUpdate(adminId, {
          $pull: { createdCourses: courseId }
      });

      await Course.findByIdAndDelete(courseId);

      res.status(200).json({ message: "Course deleted successfully!" });

  } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Internal server error while deleting course." });
  }
};

// const editCourse = async (req, res) => {
//   const adminId = req.admin?._id
//   if(!adminId) {
//     return res.status(401).json({
//       "message" : "Unauthorized Access!!!"
//     })
//   }

//   try {
//       const courseId = req.params.courseId;

//       const { title, description, imageLink, price } = req.body;

//       if (!title && !description && !imageLink && !price) {
//           return res.status(400).json({ message: "At least one field is required to update." });
//       }

      
//       const course = await Course.findById(courseId);
//       if (!course) {
//           return res.status(404).json({ message: "Course not found." });
//       }

//       const updatedCourse = await Course.findByIdAndUpdate(courseId, {
//           $set: {
//               ...(title && { title }),
//               ...(description && { description }),
//               ...(imageLink && { imageLink }),
//               ...(price && { price })
//           }
//       }, { new: true });

//       res.status(200).json({
//           message: "Course updated successfully!",
//           updatedCourse
//       });
//   } catch (error) {
//       console.error("Error editing course:", error);
//       res.status(500).json({ message: "Internal server error while editing course." });
//   }
// };

const editCourse = async (req, res) => {
    const adminId = req.admin?._id;
    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized Access!!!"
      });
    }
  
    try {
      const courseId = req.params.courseId;
      const { title, description, imageLink, price, tags } = req.body;
  
      if (!title && !description && !imageLink && !price && !tags) {
        return res.status(400).json({ message: "At least one field is required to update." });
      }
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
  
      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        ...(imageLink && { imageLink }),
        ...(price && { price }),
        ...(tags && { tags })
      };
  
      const updatedCourse = await Course.findByIdAndUpdate(courseId, {
        $set: updateData
      }, { new: true });
  
      res.status(200).json({
        message: "Course updated successfully!",
        updatedCourse
      });
    } catch (error) {
      console.error("Error editing course:", error);
      res.status(500).json({ message: "Internal server error while editing course." });
    }
  };
  

const viewCourse = async (req, res) => {
    const courseId = req.params.courseId;
  
    try {
        const course = await Course.findById(courseId)
            .populate({
                path: "videos",
                select: "-videoFile" 
            })
            .populate("teacher");
  
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving course details", error });
    }
  }
  

const viewVids = async (req, res) => {
    const courseId = req.params.courseId;
  
    try {
        const course = await Course.findById(courseId).populate("videos").populate("teacher"); 
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        res.status(200).json(course); 
    } catch (error) {
        res.status(500).json({ message: "Error retrieving course details", error });
    }
  }

const getVideosByCourse = async (req, res) => {
    const { courseId } = req.params;

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid Course ID format" });
    }

    try {
        // Find the course and populate its videos and the teacher (admin) information
        const course = await Course.findById(courseId)
            .populate("videos").populate("teacher");

        // Check if the course exists
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Return the videos array from the course, now including teacher info
        res.status(200).json(course.videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Internal server error while fetching videos' });
    }
}


const getSpecificVideo = async (req, res) => {
  const { courseId, videoId } = req.params;

  // Validate courseId and videoId format
  if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid Course ID or Video ID format" });
  }

  try {
      // Find the course and populate its videos
      const course = await Course.findById(courseId).populate('videos');

      // Check if the course exists
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      // Find the specific video within the course's videos
      const video = course.videos.find(v => v._id.toString() === videoId);

      // Check if the video exists
      if (!video) {
          return res.status(404).json({ message: 'Video not found in this course' });
      }

      // Return the video details
      res.status(200).json(video);
  } catch (error) {
      console.error('Error fetching video:', error);
      res.status(500).json({ message: 'Internal server error while fetching video' });
  }
}

module.exports = {
  
  viewCourse,
  viewAllCourses,
  deleteCourse,
  editCourse,
  getVideosByCourse,
  getSpecificVideo,
  viewVids
}