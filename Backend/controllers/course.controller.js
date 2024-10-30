const Course = require("../models/course.model") 
const Admin = require("../models/admin.model") 


const viewAllCourses = async (req, res) => {
 
  console.log(Course)
  const response = await Course.find({})
  res.json({courses : response})

}

const deleteCourse = async (req, res) => {
  const adminId = req.admin?._id
  if(!adminId) {
    return res.status(401).json({
      "message" : "Unauthorized Access!!!"
    })
  }

  try {
      const courseId = req.params.courseId;
     
      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ message: "Course not found." });
      }
      
      await Admin.findByIdAndUpdate(adminId, {
          $pull: { createdCourses: courseId }
      });

      await Course.findByIdAndDelete(courseId);

      res.status(200).json({ message: "Course deleted successfully!" });

  } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Internal server error while deleting course." });
  }
};

const editCourse = async (req, res) => {
  const adminId = req.admin?._id
  if(!adminId) {
    return res.status(401).json({
      "message" : "Unauthorized Access!!!"
    })
  }

  try {
      const courseId = req.params.courseId;

      const { title, description, imageLink, price } = req.body;

      if (!title && !description && !imageLink && !price) {
          return res.status(400).json({ message: "At least one field is required to update." });
      }

      
      const course = await Course.findById(courseId);
      if (!course) {
          return res.status(404).json({ message: "Course not found." });
      }

      const updatedCourse = await Course.findByIdAndUpdate(courseId, {
          $set: {
              ...(title && { title }),
              ...(description && { description }),
              ...(imageLink && { imageLink }),
              ...(price && { price })
          }
      }, { new: true });

      res.status(200).json({
          message: "Course updated successfully!",
          updatedCourse
      });
  } catch (error) {
      console.error("Error editing course:", error);
      res.status(500).json({ message: "Internal server error while editing course." });
  }
};

const viewCourse = async (req, res) => {
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
}

module.exports = {
  
  viewCourse,
  viewAllCourses,
  deleteCourse,
  editCourse
}