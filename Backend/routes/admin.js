const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const tokenMiddleware = require("../middleware/tokenmiddleware"); 
const  Admin  = require("../models/admin.model");
const  Course  = require("../models/course.model");
const User = require("../models/user.model");
const Video = require("../models/video.model")
const router = Router();
const jwt = require('jsonwebtoken');
const {upload} = require('../middleware/multer');
const { uploadOnCloudinary , destroy } = require('../utils/cloudinary');
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET;



router.post('/signup', async (req, res) => {
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
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Admin.findOne({ username, password });

        if (user) {
            const token = jwt.sign({
                _id: user._id.toString(),
                username: user.username
            }, jwt_secret);

            res.setHeader('Authorization', `Bearer ${token}`);

            return res.json({ token });
        } else {
            return res.status(401).json({ message: "Invalid Username/Password" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/verify-token', tokenMiddleware, (req, res) => {
    console.log(req.username);
    res.status(200).json({ message: 'Token is valid', user: req.user });
});

router.post('/createCourse', async (req, res) => {
    console.log("entered here")
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const words = token.split(" ");
    const jwtToken = words[1];
    console.log(jwtToken);

    try {
        const decodedValue = jwt.verify(jwtToken, jwt_secret);
        const adminId = decodedValue._id;

        console.log("Admin ID from token:", decodedValue._id);

        const { title, description, imageLink, price } = req.body;
        if (!title || !description || !imageLink || !price) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newCourse = await Course.create({
            title,
            description,
            imageLink,
            price
        });

        await Admin.findByIdAndUpdate(adminId, {
            $push: { createdCourses: newCourse._id }
        });

        res.status(201).json({
            adminId,
            message: "Course created successfully!",
            courseId: newCourse._id
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error while creating course." });
    }
});

router.get('/courses', async (req, res) => {
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
});

router.delete('/deleteCourse/:courseId', async (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const words = token.split(" ");
    const jwtToken = words[1];

    try {
        const decodedValue = jwt.verify(jwtToken, jwt_secret);
        const adminId = decodedValue._id;
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
});

router.put('/editCourse/:courseId', async (req, res) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const words = token.split(" ");
    const jwtToken = words[1];

    try {
        const decodedValue = jwt.verify(jwtToken, jwt_secret);
        const adminId = decodedValue._id;
        const courseId = req.params.courseId;

        const { title, description, imageLink, price } = req.body;

        if (!title && !description && !imageLink && !price) {
            return res.status(400).json({ message: "At least one field is required to update." });
        }

        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $set: {
                ...(title && { title }),
                ...(description && { description }),
                ...(imageLink && { imageLink }),
                ...(price && { price })
            }
        }, { new: true });

        res.status(200).json({
            message: "Course updated successfully!",
            updatedCourse
        });
    } catch (error) {
        console.error("Error editing course:", error);
        res.status(500).json({ message: "Internal server error while editing course." });
    }
});

router.get('/teacherInfo', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const words = token.split(" ");
    const jwtToken = words[1];

    try {
        const decodedValue = jwt.verify(jwtToken, jwt_secret);
        const adminId = decodedValue._id;

        //  excluding 'username' and 'password'
        const adminData = await Admin.findById(adminId)
            .select('-username -password')
            .populate('createdCourses');  // reference ki jagah pura course data

        if (!adminData) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json(adminData);
    } catch (error) {
        console.error("Error fetching admin data:", error);
        res.status(500).json({ message: "Internal server error while fetching admin data." });
    }
});

router.put('/editProfile', upload.single('avatar'), async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const words = token.split(" ");
    const jwtToken = words[1];

    try {
        const decodedValue = jwt.verify(jwtToken, jwt_secret);
        const adminId = decodedValue._id;

        const { name, age, experience, gender, company, bio } = req.body;

      
        if (!name && !age && !experience && !gender && !company && !bio && !req.file) {
            return res.status(400).json({ message: "At least one field is required to update." });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        
        const updateFields = {};
        if (name) updateFields.name = name;
        if (age) updateFields.age = age;
        if (experience) updateFields.experience = experience;
        if (gender) updateFields.gender = gender;
        if (company) updateFields.company = company;
        if (bio) updateFields.bio = bio;

        
        if (req.file) {
            const localFilePath = req.file.path;

           
            if (admin.avatar) {
                const publicId = admin.avatar.split('/').pop().split('.')[0]; // Extract public ID
                await destroy(publicId); 
            }

            const imageUrl = await uploadOnCloudinary(localFilePath); // Upload new avatar
            updateFields.avatar = imageUrl;
        }

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
});

router.post('/uploadVideo/:courseId', upload.single('videoFile'), async (req, res) => {
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
});





module.exports = router;
