const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateSignup, validateSignin } = require("../middleware/validation");
const {
  registerUser,
  completeStudentProfile,
  signin,
  googleCallback,
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

router.post("/student-profile", async (req, res) => {
  try {
    const { userId, university, studentId, course, yearOfStudy } = req.body;

    const studentProfile = new StudentProfile({
      userId,
      university,
      studentId,
      course,
      yearOfStudy,
    });

    await studentProfile.save();
    res.status(201).json({ message: "Student profile created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating student profile",
        error: error.message,
      });
  }
});

module.exports = router;
