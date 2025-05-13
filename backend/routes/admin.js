const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/verifyToken");
const {
  getPendingLandlords,
  approveLandlord,
  rejectLandlord,
} = require("../controllers/landlordVerifyController");
const {
  getAllUsers,
  flagUsers,
} = require("../controllers/manageUsersController");
const { addUniversity } = require("../controllers/universityController");
const {
  getListingStats,
  getReportStats,
  getReviewStats,
  getScheduleStats,
  getUserStats,
  getCommunicationStats,
} = require("../controllers/adminStatsController");

// Protected admin routes
router.get("/unverified-landlords", verifyToken, getPendingLandlords);
router.post("/approve-landlord/:userId", verifyToken, approveLandlord);
router.delete("/reject-landlord/:userId", verifyToken, rejectLandlord);
router.post("/add-university", verifyToken, addUniversity);

// User management routes
router.get("/all-users", verifyToken, getAllUsers);
router.patch("/toggle-user-flag/:userId", verifyToken, flagUsers);

// Admin statistics routes
router.get("/listing-stats", verifyToken, getListingStats);
router.get("/report-stats", verifyToken, getReportStats);
router.get("/review-stats", verifyToken, getReviewStats);
router.get("/schedule-stats", verifyToken, getScheduleStats);
router.get("/user-stats", verifyToken, getUserStats);
router.get("/communication-stats", verifyToken, getCommunicationStats);

module.exports = router;
