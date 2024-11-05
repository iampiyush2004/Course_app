const { Router } = require("express");
const { viewAllCourses,
        viewCourse,
        getVideosByCourse,
        getSpecificVideo,
        viewVids } = require("../controllers/course.controller");

const router = Router();

router.get("/", viewAllCourses);

router.get('/:courseId', viewCourse);

router.get('/videos/:courseId', viewVids);

router.get("/:courseId/videos", getVideosByCourse);

router.get('/:courseId/videos/:videoId', getSpecificVideo)

module.exports = router;