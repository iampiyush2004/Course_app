const { Router } = require("express");
const router = Router();

const { upload } = require('../middleware/multer');

const {
    signup,
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
} = require("../controllers/admin.controller");

const {
    deleteCourse,
    editCourse
} = require("../controllers/course.controller");

const {
    getNotifications,
    createNotification,
    deleteNotification,
    markAsRead
} = require("../controllers/notification.controller");

const verifyJwt = require("../middleware/auth.middleware");

require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET;

// Admin Authentication Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', verifyJwt, logout);
router.get('/isLoggedin', isLoggedin);

// Notification Routes
router.get('/notifications', verifyJwt, getNotifications); // View all notifications
router.post('/notifications', verifyJwt, createNotification); // Create a notification
router.delete("/notifications/:notificationId", verifyJwt, deleteNotification); // delete specific notifications
router.put("/notifications/:notificationId/mark-as-read", verifyJwt, markAsRead); //  mark notifications as read

// Admin Profile Routes
router.get('/teacherInfo', verifyJwt, teacherInfo);
router.put('/editProfile', verifyJwt, editProfile);
router.post('/upload-image', verifyJwt, upload.single('avatar'), updateAvatar);

// Course Management Routes
router.post('/createCourse', verifyJwt, upload.single('imageLink'), createCourse);
router.get('/courses', verifyJwt, adminSpecificCourses);
router.post(
    '/uploadVideo/:courseId',
    verifyJwt,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
);
router.delete('/deleteCourse/:courseId', verifyJwt, deleteCourse);
router.put('/editCourse/:courseId', verifyJwt, editCourse);
router.delete('/courses/:courseId/videos/:videoId', verifyJwt, deleteVideo);
router.get('/:id', teacherPage);



module.exports = router;
