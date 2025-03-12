const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isVerified: true }).select('username email role createdAt isFlagged');

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

exports.flagUsers = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user first
        const existingUser = await User.findById(userId);
        
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Toggle the flag status
        const user = await User.findByIdAndUpdate(
            userId,
            { isFlagged: !existingUser.isFlagged },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: user.isFlagged ? "User flagged successfully" : "User unflagged successfully",
            user
        });
    } catch (error) {
        console.error("Error flagging user:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user flag status"
        });
    }
}