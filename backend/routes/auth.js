const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateSignup, validateSignin, validateLandlordSignup1, validateLandlordSignup2, validateLandlordSignin } = require("../middleware/validation");
const upload = require('../middleware/upload');

const {
  login,
  logout,
  signup,
  verifyEmail,
  checkAuth,
  googleCallback,
} = require("../controllers/authController");
const { verifyToken } = require('../middleware/verifyToken');

const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminAuthController");

const { registerLandlord, completeLandlordProfile, landlordSignin } = require("../controllers/landlordAuthController");

// Student auth routes
router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", validateSignup, signup);
router.post("/login", validateSignin, login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

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

// Admin auth routes
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
