const { Router } = require("express");
const { viewAllCourses, viewCourse } = require("../controllers/course.controller");
const router = Router();

router.get("/", viewAllCourses);

router.get('/:courseId', viewCourse);


module.exports = router;