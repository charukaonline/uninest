const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId, role = "landlord") => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("landlordToken", token, {
    httpOnly: true, // ✅ Secure and prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // ✅ Enable in production
    sameSite: "Lax", // ✅ Prevents CSRF attacks while allowing frontend access
    path: "/", // ✅ Ensures accessibility across routes
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };
