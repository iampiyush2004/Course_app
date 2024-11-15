const { Router } = require("express");
const router = Router();
const verifyJwt = require("../middleware/authUser.middleware")
const { signin ,
        signup ,
        logout,
        myCourses,
        isLoggedin,
        returnMe,
        editUserProfile,
        updateUserAvatar} = require("../controllers/user.controller");

const {deleteNotification , getNotifications , markAsRead} = require("../controllers/notification.controller")        

const { viewCourse } = require("../controllers/course.controller");
const {upload} = require('../middleware/multer');
const { order, capture, hasPurchased } = require("../controllers/payment.controller");

router.put('/editProfile', verifyJwt, editUserProfile);

router.put('/updateAvatar',verifyJwt, upload.single('avatar'), updateUserAvatar);

router.get('/me', verifyJwt, returnMe);

router.post('/signup', upload.single("avatar"), signup);

router.post('/signin', signin);


// Notification Routes
router.get('/notifications', verifyJwt, getNotifications); // View all notifications
router.delete("/notifications/:notificationId", verifyJwt, deleteNotification); // delete specific notifications
router.put("/notifications/:notificationId/mark-as-read", verifyJwt, markAsRead); //  mark notifications as read

router.post('/logout', verifyJwt, logout);

router.get('/myCourses',verifyJwt , myCourses);

router.get('/myCourses/:courseId' , viewCourse);

router.post("/buyCourse/order", verifyJwt, order); // Route to create order
   
router.post("/buyCourse/capture", verifyJwt, capture); // Route to capture payment

router.get("/hasPurchased/:courseId", verifyJwt, hasPurchased);

router.get("/loggedin",isLoggedin)

module.exports = router;

module.exports = router