const express = require("express");
const router = express.Router();
const mistakeController = require("../controllers/mistakeController");
const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(protect, mistakeController.getMistakes)
  .post(protect, mistakeController.createMistake);

router.route("/:id").put(protect, mistakeController.updateMistake);

module.exports = router;
