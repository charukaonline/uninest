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
} = require("../controllers/manageUsersController");

// Protected admin routes
router.get("/unverified-landlords", verifyToken, getPendingLandlords);
router.post("/approve-landlord/:userId", verifyToken, approveLandlord);
router.delete("/reject-landlord/:userId", verifyToken, rejectLandlord);

// User management routes
router.get("/all-users", verifyToken, getAllUsers);

module.exports = router;
