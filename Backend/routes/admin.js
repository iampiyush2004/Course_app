
const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const tokenMiddleware = require("../middleware/tokenmiddleware");
const { Admin, User, Course } = require('../db');
const router = Router();
const jwt = require('jsonwebtoken');
const { jwt_secret } = require("../config");

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

router.put('/editProfile', async (req, res) => {
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

        // Check if at least one field is provided to update
        if (!name && !age && !experience && !gender && !company && !bio) {
            return res.status(400).json({ message: "At least one field is required to update." });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        // Prepare update fields
        const updateFields = {};
        if (name) updateFields.name = name;
        if (age) updateFields.age = age;
        if (experience) updateFields.experience = experience;
        if (gender) updateFields.gender = gender;
        if (company) updateFields.company = company;
        if (bio) updateFields.bio = bio;

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




module.exports = router;
