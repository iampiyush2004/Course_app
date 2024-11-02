const { Router } = require("express");
const router = Router();
const verifyJwt = require("../middleware/authUser.middleware")
const { signin ,
        signup ,
        logout,
        myCourses} = require("../controllers/user.controller");

const { viewCourse } = require("../controllers/course.controller");

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/logout', verifyJwt, logout);

router.get('/myCourses',verifyJwt , myCourses);

router.get('/myCourses/:courseId' , viewCourse)

module.exports = router