const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const listingController = require("../controllers/listingController");
const { verifyToken } = require("../middleware/verifyToken"); // Use the correct middleware

// Route to add a listing (Landlord authentication required)
router.post(
  "/add",
  verifyToken,
  upload.array("images", 5),
  listingController.addListing
);

module.exports = router;
