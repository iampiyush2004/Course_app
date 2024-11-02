const { Router } = require("express");
const router = Router();
const verifyJwt = require("../middleware/authUser.middleware")
const {signin , signup , logout} = require("../controllers/user.controller")

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/logout', verifyJwt, logout);

module.exports = router