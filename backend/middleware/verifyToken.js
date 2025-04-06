const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyToken = async (req, res, next) => {
  // Get both token types
  const token = req.cookies.token;
  const landlordToken = req.cookies.landlordToken;

  // Try landlord token first, then regular token
  const tokenToUse = landlordToken || token;

  if (!tokenToUse) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided",
    });
  }

  try {
    const decoded = jwt.verify(tokenToUse, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Fetch the user and attach to request
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(
      `Authenticated ${user.role} user: ${user.username} (${user._id})`
    );

    req.user = user; // Attach full user object
    next();
  } catch (error) {
    console.log("Error in verify token", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized - invalid token",
    });
  }
};
