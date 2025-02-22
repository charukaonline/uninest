const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  console.log("Received Cookies:", req.cookies);

  const token = req.cookies.landlordToken;

  if (!token) {
    console.log("No landlord token found in cookies");
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    console.log("Error in verify token", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized - invalid token",
    });
  }
};
