const express = require("express");
const router = express.Router();
const leetcodeController = require("../controllers/leetcodeController");
const { protect } = require("../middleware/auth");

router.post("/sync", protect, leetcodeController.sync);

module.exports = router;
