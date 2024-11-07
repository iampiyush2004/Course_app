const { Router } = require("express");
const router = Router();
const verifyJwt = require("../middleware/authUser.middleware")
const {updateProgress, getProgress} = require("../controllers/progress.controller")

router.put("/update/:courseId",verifyJwt,updateProgress)
router.get("/getProgress/:courseId",verifyJwt,getProgress)

module.exports = router