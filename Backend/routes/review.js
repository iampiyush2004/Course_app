const { Router } = require("express");
const {getCourseReview,
      addReview,
      getCoureStudentReview,
      editReview,
      deleteReview,
      getStudentReview
      } = require("../controllers/review.controller")

const verifyJwt =  require("../middleware/authUser.middleware")
const router = Router();

router.get("/course/:courseId",getCourseReview)
router.post("/:courseId",verifyJwt,addReview)
router.put("/edit/:courseId",verifyJwt,editReview)
router.get("/student/:courseId",verifyJwt,getCoureStudentReview)
router.delete("/student/:courseId",verifyJwt,deleteReview)
router.get("/reviewStudent", verifyJwt, getStudentReview);

module.exports = router;