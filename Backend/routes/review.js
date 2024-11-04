const { Router } = require("express");
const {getCourseReview,
  addReview,
} = require("../controllers/review.controller")

const verifyJwt =  require("../middleware/authUser.middleware")
const router = Router();

router.get("/:courseId",getCourseReview)
router.post("/:courseId",verifyJwt,addReview)


module.exports = router;