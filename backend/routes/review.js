const express = require('express');
const router = express.Router();
const {addReview, getSpamReviews, approveReview, deleteReview} = require('../controllers/reviewController');
const {verifyToken} = require('../middleware/verifyToken');
const Admin = require("../models/Admin");

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.userId);
        
        if (!admin) {
            return res.status(403).json({
                success: false,
                message: "Access denied - Admin privileges required"
            });
        }
        
        next();
    } catch (error) {
        console.error("Error checking admin status:", error);
        res.status(500).json({
            success: false,
            message: "Server error while verifying admin privileges"
        });
    }
};

// Public route
router.post('/add-review', addReview);

// Admin routes
router.get('/spam-reviews', verifyToken, isAdmin, getSpamReviews);
router.patch('/approve/:id', verifyToken, isAdmin, approveReview);
router.delete('/delete/:id', verifyToken, isAdmin, deleteReview);

module.exports = router;