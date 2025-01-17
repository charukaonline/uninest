const express = require("express");
const router = express.Router();
const { validateSignup, validateSignin } = require("../middleware/validation");
const {
  registerUser,
  completeStudentProfile,
  signin,
} = require("../controllers/authController");

router.post("/signup/step1", validateSignup, registerUser);
router.post("/signup/step2/:userId", completeStudentProfile);
router.post("/signin", validateSignin, signin);

module.exports = router;
