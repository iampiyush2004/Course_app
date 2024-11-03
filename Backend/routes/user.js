const { Router } = require("express");
const router = Router();
const verifyJwt = require("../middleware/authUser.middleware")
const { signin ,
        signup ,
        logout,
        myCourses} = require("../controllers/user.controller");

const { viewCourse } = require("../controllers/course.controller");

const { order, capture, hasPurchased } = require("../controllers/payment.controller");

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/logout', verifyJwt, logout);

router.get('/myCourses',verifyJwt , myCourses);

router.get('/myCourses/:courseId' , viewCourse);

router.post("/buyCourse/order", verifyJwt, order);     // Route to create order

router.post("/buyCourse/capture", verifyJwt, capture); // Route to capture payment

router.get("/hasPurchased/:courseId", verifyJwt, hasPurchased);


module.exports = router;

module.exports = router