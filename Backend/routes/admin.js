const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const tokenMiddleware = require("../middleware/auth.middleware");
const  Admin  = require("../models/admin.model");
const  Course  = require("../models/course.model");
const User = require("../models/user.model");
const Video = require("../models/video.model")
const router = Router();
const jwt = require('jsonwebtoken');
const {upload} = require('../middleware/multer');
const { uploadOnCloudinary , destroy } = require('../utils/cloudinary');

const { signup,
        signin,
        teacherInfo,
        editProfile,
        updateAvatar,
        createCourse,
        logout,
        isLoggedin,
        adminSpecificCourses,
        uploadVideo
        } = require("../controllers/admin.controller")

const { deleteCourse, editCourse} = require("../controllers/course.controller")
//const {upload} = require('../middleware/multer');
const verifyJwt = require("../middleware/auth.middleware")

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

router.get('/courses', adminSpecificCourses);

router.post('/uploadVideo/:courseId', upload.single('videoFile'), uploadVideo);

router.delete('/deleteCourse/:courseId', verifyJwt, deleteCourse);

router.put('/editCourse/:courseId', verifyJwt, editCourse);


module.exports = router;
