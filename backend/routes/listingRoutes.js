const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const imageUpload = require("../middleware/imageUpload");
const { ensureLandlordAuth } = require("../middleware/ensureLandlordAuth");

// Add a new listing
router.post(
  "/add-listing",
  ensureLandlordAuth,
  imageUpload.array("propertyImages"),
  listingController.addListing
);

// Get all listings
router.get('/', listingController.getListings);

// Get single listing by ID
router.get('/:id', listingController.getListingById);

module.exports = router;
