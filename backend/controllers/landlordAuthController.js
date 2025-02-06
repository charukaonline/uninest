const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const LandlordProfile = require("../models/LandlordProfile");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.jwt_expires_in,
  });
};

exports.registerLandlord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      fullName: username,
      phoneNumber: phone,
      role: "landlord",
      isVerified: false, // Landlords need verification
    });

    await user.save();

    const token = createToken(user._id);

    res.status(201).json({
      message: "Landlord registration initiated",
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.completeLandlordProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { residentialAddress, nationalIdCardNumber } = req.body;

    // Create landlord profile
    const landlordProfile = new LandlordProfile({
      userId,
      residentialAddress,          // Add this field
      nationalIdCardNumber,        // Add this field
      verificationStatus: "pending",
      subscription: {
        plan: "free",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      verificationDocuments: [],
    });

    await landlordProfile.save();

    res.status(200).json({
      message: "Landlord profile completed, waiting for verification",
      profile: landlordProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.landlordSignin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is a landlord
    if (user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlords only." });
    }

    // Get landlord profile and verification status
    const landlordProfile = await LandlordProfile.findOne({ userId: user._id });
    if (!landlordProfile) {
      return res.status(404).json({ message: "Landlord profile not found" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = createToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        verificationStatus: landlordProfile.verificationStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
