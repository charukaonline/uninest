const jwt = require("jsonwebtoken");

exports.generateTokenAndSetCookie = (res, userId, userType = 'student') => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const cookieName = userType === 'landlord' ? 'landlordToken' : 'token';

    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 
    });

    return token;
};
