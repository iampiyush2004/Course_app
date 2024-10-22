
const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const tokenMiddleware = require("../middleware/tokenmiddleware");
const { Admin, User, Course } = require('../db');
const router = Router();
const jwt = require('jsonwebtoken');
const { jwt_secret } = require("../config");

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const age = req.body.age;
    const experience = req.body.experience;
    const gender = req.body.gender;
    const company = req.body.company;

    await Admin.create({
        name : name,
        age : age,
        company : company ,
        gender : gender ,
        experience : experience,
        username: username,
        password: password
    });
    res.json({
        message: 'Admin created successfully!'
    });
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

module.exports = router;
