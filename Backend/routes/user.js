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

router.post('/courses/:courseId',  (req, res) => {
    //  course purchase 
    const courseId = req.params.courseId;
    const username = req.headers.username;

    User.updateOne({
        username : username
    },{
        "$push": {
            purchasedCourses : courseId
        }
    }).catch((e) => {
        console.log(e);
    });
    res.json({
        message : "Purchase Complete!"
    })

});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    //  fetching purchased courses 
});

module.exports = router