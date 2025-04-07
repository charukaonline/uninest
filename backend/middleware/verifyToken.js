const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    const landlordToken = req.cookies.landlordToken;
    
    const isLandlordRoute = req.path.includes('/landlord/');
    const relevantToken = isLandlordRoute ? landlordToken : token;

    if (!relevantToken) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized - no token provided" 
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
            message: "Unauthorized - invalid token" 
        });
    }
};
