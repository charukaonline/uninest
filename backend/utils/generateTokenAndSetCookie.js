const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId, role = "landlord") => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const cookieName = role === "admin" ? "adminToken" : "landlordToken";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });

  return token;
};

module.exports = { generateTokenAndSetCookie };
