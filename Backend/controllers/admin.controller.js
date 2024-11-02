const Admin  = require("../models/admin.model")
const jwt = require('jsonwebtoken');
const Course = require("../models/course.model");
const { uploadOnCloudinary , destroy } = require('../utils/cloudinary');
const Video = require("../models/video.model")
require('dotenv').config();

const signin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const user = await Admin.findOne({ username, password }).select("-password");
  
        if (user) {
            const token = await user.generateToken()
  
            res.setHeader('Authorization', `Bearer ${token}`);
            const options = {
              httpOnly : true,
              secure : false,
              maxAge: 30 * 24 * 60 * 60 * 1000 
            }
            return res
            .status(200)
            .cookie("token",token,options)
            .json({ token,user });
        } else {
            return res.status(401).json({ message: "Invalid Username/Password" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const signup = async (req, res) => {
  const { username, password, name, age, experience, gender, company } = req.body;
  try {
      
      const existingAdmin = await Admin.findOne({ username: username });
      if (existingAdmin) {
          return res.status(400).json({
              message: 'Username already taken. Please choose a different one.'
            });
        }
        await Admin.create({
            name: name,
            age: age,
            company: company,
            gender: gender,
            experience: experience,
            username: username,
            password: password
        });

      res.json({
          message: 'Admin created successfully!'
      });
  } catch (error) {
      res.status(500).json({
          message: 'Error creating admin. Please try again.',
          error: error.message
      });
  }
};

const teacherInfo = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const admin = await Admin.findById(req.admin._id).select("-password").populate("createdCourses");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admin information." });
  }
};

const logout = async (req,res) => {
    res.status(200).clearCookie("token").json({
        "message" : "User Logged Out successfully!!!"
    })
}

const editProfile = async (req, res) => {
    try {
        const adminId = req.admin._id; // Get admin ID from verified token in middleware
        const { name, age, experience, gender, company, bio } = req.body;

        if (!name && !age && !experience && !gender && !company && !bio) {
            return res.status(400).json({ message: "At least one field is required to update." });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        // Prepare fields for update
        const updateFields = {};
        if (name) updateFields.name = name;
        if (age) updateFields.age = age;
        if (experience) updateFields.experience = experience;
        if (gender) updateFields.gender = gender;
        if (company) updateFields.company = company;
        if (bio) updateFields.bio = bio;

        // Update admin profile
        const updatedAdminProfile = await Admin.findByIdAndUpdate(adminId, {
            $set: updateFields
        }, { new: true });

        res.status(200).json({
            message: "Admin Profile updated successfully!",
            updatedAdminProfile
        });
    } catch (error) {
        console.error("Error editing profile:", error);
        res.status(500).json({ message: "Internal server error while editing profile." });
    }
};

const updateAvatar = async (req, res) => {
    const adminId = req.admin?._id;
    if (!adminId) {
        return res.status(401).json({
            message: "Unauthorized Access!!!"
        });
    }

    try {
        // Find the admin to get the current avatar details
        const currentAdmin = await Admin.findById(adminId);
        if (!currentAdmin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        // Get the local path of the uploaded file
        const localFilePath = req.file.path;
        const imageUrl = await uploadOnCloudinary(localFilePath); // Upload to Cloudinary

        if (!imageUrl) {
            return res.status(500).json({
                message: "Internal Server Error in Uploading Video to Cloudinary"
            });
        }

        // If there is an existing avatar, delete it from Cloudinary
        if (currentAdmin.avatar) {
            // Assuming the avatar URL is in the format: https://res.cloudinary.com/demo/image/upload/v1623672119/sample.jpg
            const publicId = currentAdmin.avatar.split('/').pop().split('.')[0]; // Get the public ID from the URL
            await destroy(publicId); // Delete the old avatar
        }

        // Update the admin with the new avatar URL
        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { avatar: imageUrl }, // Set the avatar to the new Cloudinary URL
            { new: true } // Return the updated document
        );

        if (!updatedAdmin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json({ avatarUrl: updatedAdmin.avatar }); // Return the new avatar URL
    } catch (error) {
        console.error("Error updating avatar:", error);
        res.status(500).json({ error: "Failed to upload avatar" });
    }
};


const createCourse = async (req, res) => {
    const adminId = req.admin?._id;

    if (!adminId) {
        return res.status(401).json({
        message: "Unauthorized Access!!!"
        });
    }

    try {
        const { title, shortDescription, detailedDescription, price } = req.body;

        if (!title || !shortDescription || !detailedDescription || !price || !req.file || !req.file.path) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const imageLink = await uploadOnCloudinary(req.file.path);
        if (!imageLink) {
            return res.status(500).json({
                message: "Internal Server Error while uploading to Cloudinary!!!"
            });
        }

        // Create new course
        const newCourse = await Course.create({
            title,
            description : shortDescription,
            bio : detailedDescription,
            imageLink,
            price,
            teacher: adminId
        });

        // Update admin with the new course
        await Admin.findByIdAndUpdate(adminId, {
            $push: { createdCourses: newCourse._id }
        });

        // Send success response
        res.status(200).json({
            adminId,
            message: "Course created successfully!",
            courseId: newCourse._id
        });

    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error while creating course." });
    }
};
  

const isLoggedin = async(req, res) => {
    const token = req.cookies?.token
    if(!token){
        return res.status(200).json({"isLoggedin" : false,"message" : "Admin needs to login"})
    }
    try {
        const decodedValue = jwt.verify(token,process.env.JWT_SECRET)
        const admin = await Admin.findById(decodedValue).select("-password")
        if(!admin){
            return res.status(200).json({"isLoggedin" : false, "message" : "Admin needs to login"})
        }
        return res.status(200).json({"isLoggedin" : true, admin,"message" : "Admin is logged in already!!!"})
    } catch (error) {
        return res.status(500).json({"message":"Internal Error"})   
    }
}

const adminSpecificCourses = async (req, res) => {
    try {
        // Access authenticated admin from `verifyJwt` middleware
        const admin = req.admin;

        // Log the admin object for debugging
        console.log("Authenticated Admin:", admin);

        // Check if admin has createdCourses
        if (!admin || !admin.createdCourses) {
            return res.status(403).json({ message: "Admin not found or no courses created" });
        }

        // Find courses created by this admin
        const courses = await Course.find({
            _id: { "$in": admin.createdCourses }
        });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }

        // Return the courses found
        res.json({ courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const uploadVideo = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, duration } = req.body;

    if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
    }

    try {
        const owner = req.admin._id; 

        if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
            return res.status(400).json({ message: "Both video and thumbnail files are required" });
        }

        const videoFileUrl = await uploadOnCloudinary(req.files.videoFile[0].path);
        if (!videoFileUrl) {
            return res.status(500).json({ message: "Failed to upload video to Cloudinary" });
        }

        const thumbnailUrl = await uploadOnCloudinary(req.files.thumbnail[0].path);
        if (!thumbnailUrl) {
            return res.status(500).json({ message: "Failed to upload thumbnail to Cloudinary" });
        }

        const newVideo = new Video({
            videoFile: videoFileUrl,
            thumbnail: thumbnailUrl,
            createdBy: owner,
            title,
            description,
            duration,
            isPublished: true,
            belongsTo: courseId,
        });

        const savedVideo = await newVideo.save();

        const course = await Course.findByIdAndUpdate(
            courseId,
            { $push: { videos: savedVideo._id } },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({
            message: 'Video uploaded successfully',
            video: savedVideo,
            course,
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ message: 'Internal server error while uploading video' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { courseId, videoId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);
        if (videoIndex === -1) {
            return res.status(404).json({ message: 'Video not found in course' });
        }

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found in Videos collection' });
        }

        // Ensure only the creator (admin) can delete their video
        if (video.createdBy.toString() !== req.admin._id.toString()) {
            return res.status(403).json({ message: "Access Denied: You can only delete videos you created" });
        }

        // Check if the video has a URL before attempting to split it
        if (!video.videoFile) {
            return res.status(400).json({ message: 'Video file URL is missing' });
        }

        // Delete video from Cloudinary
        const publicId = video.videoFile.split('/').pop().split('.')[0]; // Use video.videoFile instead of video.url
        await destroy(publicId);

        // Remove video from course document
        course.videos.splice(videoIndex, 1);
        await course.save();

        // Delete video from the Videos collection
        await Video.findByIdAndDelete(videoId);

        res.status(200).json({ message: 'Video deleted successfully from course and Videos collection' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete video' });
    }
};

const teacherPage = async (req, res) => {
    try {
      const { id } = req.params; // Get the admin ID from URL parameters
  
      const admin = await Admin.findById(id).select("-password").populate("createdCourses");
  
      if (!admin) {
        return res.status(404).json({ message: "Admin not found." });
      }
  
      return res.status(200).json(admin);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching admin information." });
    }
  };
  


module.exports = {
  signup,
  signin,
  teacherInfo,
  editProfile,
  updateAvatar,
  createCourse,
  logout,
  isLoggedin,
  adminSpecificCourses,
  uploadVideo,
  deleteVideo,
  teacherPage

}