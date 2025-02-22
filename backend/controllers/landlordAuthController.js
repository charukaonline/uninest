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
    const token = generateTokenAndSetCookie(res, landlord._id, "landlord");

    res.cookie("landlordToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

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
