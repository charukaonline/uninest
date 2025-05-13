const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
// const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// Submit feedback route (accessible to all authenticated users)
router.post("/submit", feedbackController.submitFeedback);

// Admin routes for managing feedback
// router.get("/all", authenticateUser, isAdmin, feedbackController.getAllFeedback);
// router.patch("/:id/status", authenticateUser, isAdmin, feedbackController.updateFeedbackStatus);

module.exports = router;