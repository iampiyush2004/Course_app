const { Router } = require("express");
const  Course  = require("../models/course.model");
const router = Router();

router.get("/", async (req, res) => {
 
    console.log(Course)
    const response = await Course.find({})
    res.json({courses : response})
  
  });

  router.get('/:courseId', async (req, res) => {
    const courseId = req.params.courseId;

    try {
        const course = await Course.findById(courseId); 
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        res.status(200).json(course); 
    } catch (error) {
      console.log(error);
        res.status(500).json({ message: "Error retrieving course details", error });
    }
});


module.exports = router;