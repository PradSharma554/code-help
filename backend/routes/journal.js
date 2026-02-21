const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController");
const { protect } = require("../middleware/auth");

router.post("/insight", protect, journalController.getInsight);

module.exports = router;
