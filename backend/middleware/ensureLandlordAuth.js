const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.ensureLandlordAuth = async (req, res, next) => {
  try {
    const token = req.cookies.landlordToken;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const landlord = await User.findById(decoded.userId)
      .select("-password")
      .where("role")
      .equals("landlord");
    if (!landlord) {
      return res.status(401).json({ message: "Landlord not found" });
    }
    req.user = landlord; // Attach landlord to request
    next();
  } catch (error) {
    console.error("Error in landlord auth middleware:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
