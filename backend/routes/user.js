const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/leetcode", protect, userController.getLeetcodeUsername);
router.put("/leetcode", protect, userController.updateLeetcodeUsername);

module.exports = router;
