const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/verifyToken");
const {
  getPendingLandlords,
  approveLandlord,
  rejectLandlord,
} = require("../controllers/landlordVerifyController");
const { getAllUsers } = require("../controllers/manageUsersController");
const {
  addUniversity,
  getAllUniversities,
} = require("../controllers/universityController");

// Protected admin routes
router.get("/unverified-landlords", verifyToken, getPendingLandlords);
router.post("/approve-landlord/:userId", verifyToken, approveLandlord);
router.delete("/reject-landlord/:userId", verifyToken, rejectLandlord);
router.post("/add-university", verifyToken, addUniversity);
router.get("/all-universities", verifyToken, getAllUniversities);

// User management routes
router.get("/all-users", verifyToken, getAllUsers);

module.exports = router;
