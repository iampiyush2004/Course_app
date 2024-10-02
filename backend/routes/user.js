const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup', (req, res) => {
    //  user signup 
});

router.post('/signin', (req, res) => {
    //  admin signup 
});

router.get('/courses', (req, res) => {
    //  listing all courses 
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    //  course purchase 
    const username = req.username;
    console.log(username);

});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    //  fetching purchased courses 
});

module.exports = router