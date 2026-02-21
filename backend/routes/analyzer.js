const express = require("express");
const router = express.Router();
const analyzerController = require("../controllers/analyzerController");
const { protect } = require("../middleware/auth");

router.post("/analyze", protect, analyzerController.analyzeCode);
router.post("/assist", protect, analyzerController.assist);

module.exports = router;
