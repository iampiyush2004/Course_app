const Admin  = require("../models/admin.model")
const jwt = require('jsonwebtoken');
const Course = require("../models/course.model");
//const {uploadOnCloudinary} = require("../utils/cloudinary")
const { json } = require("express");
const { uploadOnCloudinary , destroy } = require('../utils/cloudinary');
const Video = require("../models/video.model")

const signin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const user = await Admin.findOne({ username, password }).select("-password");
  
        if (user) {
            const token = await user.generateToken()
  
            res.setHeader('Authorization', `Bearer ${token}`);
            const options = {
              httpOnly : true,
              secure : false
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

    const admin = await Admin.findById(req.admin._id).populate("createdCourses");

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

        // Check if at least one field is provided for the update
        if (!name && !age && !experience && !gender && !company && !bio && !req.file) {
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

        // If a new avatar file is provided, handle Cloudinary upload and update
        if (req.file) {
            const localFilePath = req.file.path;

            // Delete the existing avatar from Cloudinary if present
            if (admin.avatar) {
                const publicId = admin.avatar.split('/').pop().split('.')[0];
                await destroy(publicId);
            }

            // Upload new avatar and add to update fields
            const imageUrl = await uploadOnCloudinary(localFilePath);
            updateFields.avatar = imageUrl;
        }

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
  const token = req.headers.authorization;

  if (!token) {
      return res.status(401).json({ message: "No token provided" });
  }

  const words = token.split(" ");
  const jwtToken = words[1];

  try {
      // Verify the JWT token and extract the admin ID
      const decodedValue = jwt.verify(jwtToken, process.env.JWT_SECRET);
      const adminId = decodedValue._id; // Extract admin ID from decoded token

      const localFilePath = req.file.path; // Get the local path of the uploaded file
      const imageUrl = await uploadOnCloudinary(localFilePath); // Upload to Cloudinary

      // Update the admin document with the new avatar URL
      const updatedAdmin = await Admin.findByIdAndUpdate(
          adminId, // Use the admin ID extracted from the token
          { avatar: imageUrl }, // Set the avatar to the new Cloudinary URL
          { new: true } // Return the updated document
      );

      if (!updatedAdmin) {
          return res.status(404).json({ error: "Admin not found" });
      }

      res.status(200).json({ avatarUrl: updatedAdmin.avatar }); // Return the new avatar URL
  } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ error: "Failed to upload avatar" });
  }
};

const createCourse = async (req, res) => {
  const adminId = req.admin?._id
  if(!adminId) {
    return res.status(401,"Unauthorised Access!!!")
  }
  try {
      const { title, description, imageLink, price } = req.body;
      if (!title || !description || !imageLink || !price) {
          return res.status(400).json({ message: "All fields are required." });
      }

      const newCourse = await Course.create({
          title,
          description,
          imageLink,
          price,
          teacher : adminId
      });

      await Admin.findByIdAndUpdate(adminId, {
          $push: { createdCourses: newCourse._id }
      });

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
    if(req.admin){
        return res.status(200).json({
            "message" : "User is Loggedin"
        })
    }
    return res.status(400,"Unauthorized Access!!!")
}

const adminSpecificCourses = async (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    try {
        const words = token.split(" ");
        const jwtToken = words[1];
        const decodedValue = jwt.verify(jwtToken, jwt_secret);

        const admin = await Admin.findOne({
            username: decodedValue.username
        });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const courses = await Course.find({
            _id: {
                "$in": admin.createdCourses
            }
        });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }

        res.json({ courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const uploadVideo =  async (req, res) => {
    const { courseId } = req.params;
    if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
    }
    try {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided or invalid format" });
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwt_secret);

        const { title, description, duration} = req.body;
        const owner = decoded._id; // Assuming the token contains the user's ID as `_id`

        // Check if a video file is provided
        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded" });
        }

        const localFilePath = req.file.path;

        // Upload video to Cloudinary
        const videoUrl = await uploadOnCloudinary(localFilePath);

        // Create video document in the database
        const newVideo = new Video({
            videoFile: videoUrl,
            thumbnail: '', // Add thumbnail upload if needed
            owner,
            title,
            description,
            duration,
            isPublished: true,
        });

        const savedVideo = await newVideo.save();

        // Update the Course document to include this video
        const course = await Course.findByIdAndUpdate(
            courseId,
            { $push: { videos: savedVideo._id } },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(201).json({
            message: 'Video uploaded successfully',
            video: savedVideo,
            course,
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: 'Internal server error while uploading video' });
    }
}



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

}