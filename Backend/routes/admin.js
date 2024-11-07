const { Router } = require("express");
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
        deleteVideo,
        teacherPage
        } = require("../controllers/admin.controller")

const { deleteCourse, editCourse } = require("../controllers/course.controller")
//const {upload} = require('../middleware/multer');
const verifyJwt = require("../middleware/auth.middleware")

require('dotenv').config();

const jwt_secret = process.env.JWT_SECRET;

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/logout', verifyJwt, logout);

router.get('/teacherInfo',verifyJwt, teacherInfo);

router.put('/editProfile', verifyJwt, editProfile);

router.post('/upload-image',verifyJwt, upload.single('avatar'), updateAvatar);

router.post('/createCourse',verifyJwt, upload.single('imageLink'),createCourse);

router.get("/isLoggedin",isLoggedin);

router.get('/courses', verifyJwt ,adminSpecificCourses);

router.post('/uploadVideo/:courseId', verifyJwt, 
  upload.fields([
    { 
      name: "videoFile",
      maxCount: 1
    },
    {
      name: "thumbnail",
      maxCount: 1
    }
  ]), uploadVideo);

router.delete('/deleteCourse/:courseId', verifyJwt, deleteCourse);

router.put('/editCourse/:courseId', verifyJwt, editCourse);

router.delete('/courses/:courseId/videos/:videoId', verifyJwt, deleteVideo);

router.get('/:id', teacherPage);

module.exports = router;
