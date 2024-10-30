const { Router } = require("express");
// const  Admin  = require("../models/admin.model");
// const  Course  = require("../models/course.model");
// const Video = require("../models/video.model")
const router = Router();

const {upload} = require('../middleware/multer');


const { signup,
        signin,
        teacherInfo,
        editProfile,
        updateAvatar,
        createCourse,
        logout,
        isLoggedin,
        adminSpecificCourses,
        uploadVideo,
        deleteVideo
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

router.get('/courses', verifyJwt ,adminSpecificCourses);

router.post('/uploadVideo/:courseId', verifyJwt, upload.single('videoFile'), uploadVideo);

router.delete('/deleteCourse/:courseId', verifyJwt, deleteCourse);

router.put('/editCourse/:courseId', verifyJwt, editCourse);

router.delete('/courses/:courseId/videos/:videoId', verifyJwt, deleteVideo);

module.exports = router;
