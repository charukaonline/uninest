const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  const landlordToken = req.cookies.landlordToken;

  // If there's a token in the Authorization header, use it
  const authHeader = req.headers.authorization;
  let headerToken = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    headerToken = authHeader.substring(7);
  }

  const isLandlordRoute = req.path.includes("/landlord/");
  // Prioritize the appropriate token based on route, but accept any valid token
  const relevantToken = isLandlordRoute
    ? landlordToken
    : token || landlordToken || headerToken;

  if (!relevantToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided",
    });
  }

  try {
    const decoded = jwt.verify(relevantToken, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verify token", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized - invalid token",
    });
  }
};
