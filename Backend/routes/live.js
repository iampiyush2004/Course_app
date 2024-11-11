const { Router } = require("express");
const { createRoom } = require("../controllers/live.controller");
const router = Router();

router.post('/create-room', createRoom);

module.exports = router;