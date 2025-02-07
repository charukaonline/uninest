const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateSignup, validateSignin, validateLandlordSignup1, validateLandlordSignup2, validateLandlordSignin } = require("../middleware/validation");
const upload = require('../middleware/upload');

const {
  registerUser,
  completeStudentProfile,
  signin,
  googleCallback,
  completePreference,
} = require("../controllers/authController");
const StudentProfile = require("../models/StudentProfile");

const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminAuthController");

const { registerLandlord, completeLandlordProfile, landlordSignin } = require("../controllers/landlordAuthController");

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

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);

// Landlord signup routes
router.post("/landlord/signup/step1", validateLandlordSignup1, registerLandlord);
router.post(
  "/landlord/signup/step2/:userId",
  upload.single('nicDocument'),
  validateLandlordSignup2,
  completeLandlordProfile
);

// Landlord auth routes
router.post("/landlord/signin", validateLandlordSignin, landlordSignin);

module.exports = router;
