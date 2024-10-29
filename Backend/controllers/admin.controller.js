const Admin  = require("../models/admin.model")
const jwt = require('jsonwebtoken');
const Course = require("../models/course.model");
const {uploadOnCloudinary} = require("../utils/cloudinary")
const { json } = require("express");

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
  const admin = req.admin
  if(!admin) {
    return res.statAdmin.us(401).json({
        "message" : "Unauthorized Access!!!"
    })
  }
  try {
      const { name, age, experience, gender, company, bio } = req.body;

      // Check if at least one field is provided to update
      if (!name && !age && !experience && !gender && !company && !bio && !req.file) {
          return res.status(400).json({ message: "At least one field is required to update." });
      }
      // Prepare update fields
      const updateFields = {};
      if (name) updateFields.name = name;
      if (age) updateFields.age = age;
      if (experience) updateFields.experience = experience;
      if (gender) updateFields.gender = gender;
      if (company) updateFields.company = company;
      if (bio) updateFields.bio = bio;

      // Check if there's an avatar file to upload
      if (req.file) {
          const localFilePath = req.file.path;
          const imageUrl = await uploadOnCloudinary(localFilePath);
          updateFields.avatar = imageUrl;
      }

      const updatedAdminProfile = await Admin.findByIdAndUpdate(admin._id, {
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

module.exports = {
  signup,
  signin,
  teacherInfo,
  editProfile,
  updateAvatar,
  createCourse,
  logout,
  isLoggedin
}