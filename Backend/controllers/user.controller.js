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
        const user = await User.findOne({ username, password }).select("-password"); // Directly match both username and password

        if (!user) {
            console.log("User not found or invalid password");
            return res.status(401).json({ message: "Invalid Username/Password" });
        }

        // Generate token without hashing comparison
        const token = user.generateToken();

        const options = {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000
        };
        res.setHeader('Authorization', `Bearer ${token}`);
        return res
            .status(200)
            .cookie("token", token, options)
            .json({ token, user: { id: user._id, username: user.username, email: user.email } });
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

        // Log the user object for debugging
        console.log("Authenticated User:", user);

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
        const user = await User.findById(decodedValue._id).select("-password")
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


module.exports = {signin , signup , logout , myCourses, isLoggedin , returnMe}