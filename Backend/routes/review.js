const { Router } = require("express");
const {getCourseReview,
      addReview,
      getCoureStudentReview,
      editReview,
      deleteReview
      } = require("../controllers/review.controller")

const verifyJwt =  require("../middleware/authUser.middleware")
const router = Router();

router.get("/:courseId",getCourseReview)
router.post("/:courseId",verifyJwt,addReview)
router.put("/edit/:courseId",verifyJwt,editReview)
router.get("/student/:courseId",verifyJwt,getCoureStudentReview)
router.delete("/student/:courseId",verifyJwt,deleteReview)

module.exports = router;