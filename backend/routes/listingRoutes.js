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

router.get('/', listingController.getListings);

router.get('/popular', listingController.getPopularListings);

router.get('/:id', listingController.getListingById);

router.post('/:id/track-click', listingController.trackListingClick);

module.exports = router;
