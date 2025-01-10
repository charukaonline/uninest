const express = require("express");
const router = express.Router();
const { validateSignup } = require("../middleware/validation");
const {
  registerUser,
  completeStudentProfile,
} = require("../controllers/authController");

router.post("/signup/step1", validateSignup, registerUser);
router.post("/signup/step2/:userId", completeStudentProfile);

module.exports = router;
