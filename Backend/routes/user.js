const { Router } = require("express");
const router = Router();
const verifyJwt = require("../middleware/authUser.middleware")
const { signin ,
        signup ,
        logout,
        myCourses,
        isLoggedin,
        returnMe} = require("../controllers/user.controller");

const { viewCourse } = require("../controllers/course.controller");
const {upload} = require('../middleware/multer');
const { order, capture, hasPurchased } = require("../controllers/payment.controller");

router.get('/me', verifyJwt, returnMe);

router.post('/signup', upload.single("avatar"), signup);

router.post('/signin', signin);

router.post('/logout', verifyJwt, logout);

router.get('/myCourses',verifyJwt , myCourses);

router.get('/myCourses/:courseId' , viewCourse);

router.post("/buyCourse/order", verifyJwt, order); // Route to create order
   
router.post("/buyCourse/capture", verifyJwt, capture); // Route to capture payment

router.get("/hasPurchased/:courseId", verifyJwt, hasPurchased);

router.get("/loggedin",isLoggedin)

module.exports = router;

module.exports = router