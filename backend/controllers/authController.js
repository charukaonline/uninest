const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const { validationResult } = require("express-validator");
const User = require("../models/User");
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail
} = require("../config/mailtrap/emails");

const { generateTokenAndSetCookie } = require("../utils/generateTokenAndSetCookie");

exports.signup = async (req, res) => {
  const { email, username, password } = req.body;

  try {

    if (!email || !password || !username) {
      throw new Error('All fields (email, username, password) are required');
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      username,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        ...user._doc,
        password: undefined
      }
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {

  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      user: {
        ...user._doc,
        password: undefined,
      }
    })

  } catch (error) {
    console.log("Error in verify email", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      }
    })

  } catch (error) {
    console.log("Error in login", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    console.log("Error in check auth", error);
    res.status(400).json({ success: false, message: error.message });
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