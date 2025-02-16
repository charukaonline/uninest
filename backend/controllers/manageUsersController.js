const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isVerified: true }).select('username email role createdAt');

        res.status(200).json({
            success: true,
            users: users
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
}