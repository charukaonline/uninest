const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const imageUpload = require("../middleware/imageUpload");
const { ensureLandlordAuth } = require("../middleware/ensureLandlordAuth");

// Add a new listing
// POST /api/listings/add-listing
router.post(
  "/add-listing",
  ensureLandlordAuth,
  imageUpload.array("propertyImages"),
  listingController.addListing
);

module.exports = router;
