const { Router } = require("express");
const { viewAllCourses,
        viewCourse,
        getVideosByCourse,
        getSpecificVideo } = require("../controllers/course.controller");

const router = Router();

router.get("/", viewAllCourses);

router.get('/:courseId', viewCourse);

router.get("/:courseId/videos", getVideosByCourse);

router.get('/:courseId/videos/:videoId', getSpecificVideo)

module.exports = router;