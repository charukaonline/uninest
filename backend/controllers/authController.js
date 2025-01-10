const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

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
      role: "student",
    });

    await user.save();

    const token = createToken(user._id);

    res.status(201).json({
      message: "User registration successful",
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.completeStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { university } = req.body;

    // Create student profile
    const studentProfile = new StudentProfile({
      userId,
      university,
      studentId: `ST${Date.now()}`, // Generate a temporary student ID
    });

    await studentProfile.save();

    // Update user verification status
    await User.findByIdAndUpdate(userId, { isVerified: true });

    res.status(200).json({
      message: "Student profile completed",
      profile: studentProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
