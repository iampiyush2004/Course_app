const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup', async(req, res) => {
    //  user signup 
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username : username,
        password : password
    })
    res.json({
        message : 'Admin created successfully!'
    })
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