const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const { validationResult } = require("express-validator");
const User = require("../models/User");
const LandlordProfile = require("../models/LandlordProfile");
const drive = require("../config/googleDrive");
const fs = require("fs").promises;
const fsSync = require("fs"); // Add this line for synchronous fs operations

const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");

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

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      username,
      phoneNumber: phone,
      role: "landlord",
      isVerified: false,
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      message: "Landlord registration initiated",
      userId: user._id,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.completeLandlordProfile = async (req, res) => {
  let uploadedFile = null;
  try {
    console.log("Starting landlord profile completion...");
    const { userId } = req.params;
    const { residentialAddress, nationalIdCardNumber } = req.body;
    const nicDocument = req.file;

    console.log("Request data:", {
      userId,
      residentialAddress,
      nationalIdCardNumber,
    });
    console.log("File:", nicDocument);

    if (!nicDocument) {
      return res.status(400).json({ message: "NIC document is required" });
    }

    uploadedFile = nicDocument.path;
    console.log("File path:", uploadedFile);

    // Check if file exists before upload
    try {
      await fs.access(uploadedFile);
      console.log("File exists and is accessible");
    } catch (error) {
      console.error("File access error:", error);
      return res
        .status(400)
        .json({ message: "File access error", error: error.message });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Uploading to Google Drive...");
    // Upload to Google Drive
    let driveResponse;
    try {
      driveResponse = await drive.files.create({
        requestBody: {
          name: `NIC_${userId}_${Date.now()}.pdf`,
          mimeType: "application/pdf",
          parents: ["1JnPe9dbyS6OHfxQUEmmKEqJrW67OQmZq"],
        },
        media: {
          mimeType: "application/pdf",
          body: fsSync.createReadStream(uploadedFile),
        },
      });
      console.log("Drive upload successful:", driveResponse.data);
    } catch (uploadError) {
      console.error("Drive upload error:", uploadError);
      throw new Error(`Drive upload failed: ${uploadError.message}`);
    }

    // Create landlord profile
    const landlordProfile = new LandlordProfile({
      userId,
      residentialAddress,
      nationalIdCardNumber,
      verificationStatus: "pending",
      verificationDocuments: [
        {
          documentType: "NIC",
          driveFileId: driveResponse.data.id,
          uploadDate: new Date(),
        },
      ],
      subscription: {
        plan: "free",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    console.log("Saving landlord profile...");
    await landlordProfile.save();

    // Clean up uploaded file
    try {
      await fs.access(uploadedFile);
      await fs.unlink(uploadedFile);
      console.log("File cleanup successful");
    } catch (unlinkError) {
      console.error("File cleanup error:", unlinkError);
    }

    res.status(200).json({
      message: "Landlord profile completed, waiting for verification",
      profile: landlordProfile,
    });
  } catch (error) {
    console.error("Complete error:", error);

    // Clean up file if it exists
    if (uploadedFile) {
      try {
        await fs.access(uploadedFile);
        await fs.unlink(uploadedFile);
      } catch (unlinkError) {
        console.error("Cleanup error:", unlinkError);
      }
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

exports.landlordSignin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email and role
    const landlord = await User.findOne({
      email,
      role: "landlord",
    });

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, landlord.password);
    if (!isPasswordValid || !landlord) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Get landlord profile
    const landlordProfile = await LandlordProfile.findOne({
      userId: landlord._id,
    });
    if (!landlordProfile) {
      return res.status(404).json({ message: "Landlord profile not found" });
    }

    // Update last login
    landlord.lastLogin = new Date();
    await landlord.save();

    // Generate token with landlord type
    generateTokenAndSetCookie(res, landlord._id, "landlord");

    res.status(200).json({
      success: true,
      landlord: {
        _id: landlord._id.toString(),
        email: landlord.email,
        username: landlord.username,
        isVerified: landlord.isVerified,
        verificationStatus: landlordProfile?.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Landlord signin error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.checkLandlordAuth = async (req, res) => {
  try {
    const token = req.cookies.landlordToken; // Change to landlordToken
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const landlord = await User.findById(decoded.userId)
      .select("-password")
      .where("role")
      .equals("landlord");

    if (!landlord) {
      return res.status(401).json({
        success: false,
        message: "Invalid landlord account",
      });
    }

    const landlordProfile = await LandlordProfile.findOne({
      userId: landlord._id,
    });

    res.status(200).json({
      success: true,
      landlord: {
        _id: landlord._id.toString(), // Changed from id to _id
        email: landlord.email,
        username: landlord.username,
        isVerified: landlord.isVerified,
        profile: landlordProfile,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

exports.logoutLandlord = async (req, res) => {
  res.clearCookie("landlordToken"); // Change to landlordToken
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
