const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateSignup, validateSignin } = require("../middleware/validation");
const {
  registerUser,
  completeStudentProfile,
  signin,
  googleCallback,
  completePreference,
} = require("../controllers/authController");
const StudentProfile = require("../models/StudentProfile");

router.post("/signup/step1", validateSignup, registerUser);
router.post("/signup/step2/:userId", completeStudentProfile);
router.post("/signin", validateSignin, signin);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  googleCallback
);

router.post("/student-profile", completePreference);

module.exports = router;
