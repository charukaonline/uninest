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

exports.signin = async (req, res) => {
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

    // Check if user is a student
    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied. Students only." });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Get student profile
    const studentProfile = await StudentProfile.findOne({ userId: user._id });

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
        university: studentProfile?.university,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const { id, emails, displayName } = req.user;

    // Check if user exists
    let user = await User.findOne({ email: emails[0].value });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email: emails[0].value,
        fullName: displayName,
        password: id + process.env.JWT_SECRET, // Create a unique password
        role: "student",
        isVerified: true, // Google users are considered verified
      });
      await user.save();
    }

    const token = createToken(user._id);

    // Redirect to frontend with token and userId
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}&userId=${user._id}`
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/error`);
  }
};

exports.completePreference = async (req, res) => {
  try {
    const { userId, university } = req.body;

    const studentProfile = new StudentProfile({
      userId,
      university,
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
}