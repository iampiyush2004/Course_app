const { Router } = require("express");
const {getCourseReview,
      addReview,
      getCoureStudentReview,
      editReview
      } = require("../controllers/review.controller")

const verifyJwt =  require("../middleware/authUser.middleware")
const router = Router();

router.get("/:courseId",getCourseReview)
router.post("/:courseId",verifyJwt,addReview)
router.put("/edit/:courseId",verifyJwt,editReview)
router.get("/student/:courseId",verifyJwt,getCoureStudentReview)


module.exports = router;