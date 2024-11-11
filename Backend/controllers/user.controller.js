const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const Course = require("../models/course.model")
const jwt = require("jsonwebtoken")
const { uploadOnCloudinary , destroy } = require('../utils/cloudinary');



const returnMe = async (req, res) => {
    try {
        // Since the user is verified and available in req.user
        res.json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            coursePurchased: req.user.coursePurchased, // Add other fields as necessary
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username only
        const user = await User.findOne({ username });
        
        // If user not found or password is incorrect
        if (!user || !(await user.isPasswordCorrect(password))) {
            console.log("User not found or invalid password");
            return res.status(401).json({ message: "Invalid Username/Password" });
        }

        // Generate JWT token
        const token = user.generateToken();

        // Set token as an HTTP-only cookie and in the Authorization header
        const options = {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        res.setHeader('Authorization', `Bearer ${token}`);
        return res
            .status(200)
            .cookie("token", token, options)
            .json({ 
                token, 
                user: { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email 
                } 
            });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const signup = async (req, res) => {
    const { username, email, name, password, dob, gender, institution } = req.body;
    if (!username) {
        throw new Error('Username is required');
      }
    try {
        if(!req.file){
            return res.status(400).json({
                message:"Avatar Required!!!"
            })
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken. Please choose a different one.' });
        }
        const avatar = await uploadOnCloudinary(req.file?.path)
        if(!avatar){
            return res.status(500).json({
                message:"Internal Server Error in uploading Avatar on cloudinary!!!"
            })
        }
        console.log(username,email,name,password,dob,gender,avatar,institution)
        // Save user without hashing the password
        const newUser = await User.create({
            username : username,
            email : email,
            name : name,
            password : password,
            dob : dob,
            gender : gender,
            avatar : avatar,
            institution : institution
        });

        res.json({ message: 'User created successfully!', user: { id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: 'Error creating User. Please try again.', error: error.message });
    }
};


const logout = async (req,res) => {
    res.status(200).clearCookie("token").json({
        "message" : "User Logged Out successfully!!!"
    })
}


const myCourses = async (req, res) => {
    try {
        // Access authenticated user from `verifyJwt` middleware
        const user = req.user;

        // Check if user has purchased courses
        if (!user || !user.coursePurchased || user.coursePurchased.length === 0) {
            return res.status(404).json({ message: "No purchased courses found" });
        }

        // Find courses purchased by this user
        const courses = await Course.find({
            _id: { "$in": user.coursePurchased }
        });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found" });
        }

        // Return the purchased courses
        res.json({ courses });
    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const isLoggedin = async (req,res) => {
    const token =  req.cookies?.token
    if (!token) {
        return res.status(200).json({
            message : "Student is not Logged In",
            isLoggedin : false,
        })
    }
    try {
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedValue._id).select("-password").populate("coursePurchased","imageLink title description ").populate("lastWatched","imageLink title description ")
        if (user) {
            return res.status(200).json({
                message : "Student is Logged In",
                isLoggedin : true,
                user : user
            })
        } else {
            return res.status(200).json({
                message : "Student is not Logged In",
                isLoggedin : false,
            })
        }
    } catch (error) {
        return res.status(200).json({
            message : "Student is not Logged In",
            isLoggedin : false,
        })
    }
}

const editUserProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from verified token in middleware
        const { username, email, name, dob, gender, institution } = req.body;

        if (!username && !email && !name && !dob && !gender && !institution) {
            return res.status(400).json({ message: "At least one field is required to update." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prepare fields for update
        const updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (name) updateFields.name = name;
        if (dob) updateFields.dob = dob;
        if (gender) updateFields.gender = gender;
        if (institution) updateFields.institution = institution;

        // Update user profile
        const updatedUserProfile = await User.findByIdAndUpdate(userId, {
            $set: updateFields
        }, { new: true }).select("-password");

        res.status(200).json({
            message: "User profile updated successfully!",
            updatedUserProfile
        });
    } catch (error) {
        console.error("Error editing user profile:", error);
        res.status(500).json({ message: "Internal server error while editing profile." });
    }
};

const updateUserAvatar = async (req, res) => {
    const userId = req.user?._id; // Assuming `verifyJwt` middleware attaches `user` to `req`
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized Access!!!"
        });
    }

    try {
        // Find the user to get the current avatar details
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get the local path of the uploaded file
        const localFilePath = req.file.path;
        const imageUrl = await uploadOnCloudinary(localFilePath); // Upload to Cloudinary

        if (!imageUrl) {
            return res.status(500).json({
                message: "Internal Server Error in Uploading Avatar to Cloudinary"
            });
        }

        // If there is an existing avatar, delete it from Cloudinary
        if (currentUser.avatar) {
            const publicId = currentUser.avatar.split('/').pop().split('.')[0]; // Extract public ID
            await destroy(publicId); // Delete the old avatar
        }

        // Update the user with the new avatar URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: imageUrl }, // Set the avatar to the new Cloudinary URL
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ avatarUrl: updatedUser.avatar }); // Return the new avatar URL
    } catch (error) {
        console.error("Error updating avatar:", error);
        res.status(500).json({ error: "Failed to upload avatar" });
    }
};

const lastWatched = async (req, res) => {
    const userId = req.user;  
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }
  
    try {
      const user = await User.findById(userId)
        .populate("lastWatched", "title description imageLink"); // Populate the course fields you want
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (!user.lastWatched) {
        return res.status(404).json({ message: "No last watched course found." });
      }
  
      return res.status(200).json({
        lastWatched: user.lastWatched,  
      });
  
    } catch (error) {
      console.error("Error occurred in fetching last watched course", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };
  


module.exports = {signin , signup , logout , myCourses, isLoggedin , returnMe , editUserProfile , updateUserAvatar, lastWatched}