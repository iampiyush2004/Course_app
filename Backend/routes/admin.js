const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const tokenMiddleware = require("../middleware/auth.middleware");
const  Admin  = require("../models/admin.model");
const  Course  = require("../models/course.model");
const User = require("../models/user.model");
const router = Router();
const jwt = require('jsonwebtoken');
const { signup,
        signin,
        teacherInfo,
        editProfile,
        updateAvatar,
        createCourse,
        logout,
        isLoggedin} = require("../controllers/admin.controller")
const { deleteCourse, editCourse} = require("../controllers/course.controller")

const {upload} = require('../middleware/multer');
const verifyJwt = require("../middleware/auth.middleware")
const { get } = require("mongoose");
const { route, post, put } = require("./user");
require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', verifyJwt, logout);
router.get('/teacherInfo',verifyJwt, teacherInfo);
router.put('/editProfile', verifyJwt, upload.single('avatar'), editProfile);
router.post('/upload-image',verifyJwt, upload.single('avatar'), updateAvatar);
router.post('/createCourse',verifyJwt, createCourse);
router.get("/isLoggedin",verifyJwt,isLoggedin);

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

router.delete('/deleteCourse/:courseId', verifyJwt, deleteCourse);
router.put('/editCourse/:courseId', verifyJwt, editCourse);


module.exports = router;
