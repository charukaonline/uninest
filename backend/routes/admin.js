const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
  getPendingLandlords,
  approveLandlord,
  rejectLandlord,
} = require("../controllers/landlordVerifyController");

// Protected admin routes
router.get("/unverified-landlords", verifyToken, getPendingLandlords);
router.post("/approve-landlord/:userId", verifyToken, approveLandlord);
router.delete("/reject-landlord/:userId", verifyToken, rejectLandlord); // Changed to DELETE method

module.exports = router;
