const express = require("express");
const router = express.Router();
const { Register, Login, getUser } = require("../controllers/userAuth");
const protect  = require("../middleware/authMiddleWar");

router.post("/login", Login);
router.post("/signup", Register);
router.get("/:id/user",getUser);

module.exports = router;
 