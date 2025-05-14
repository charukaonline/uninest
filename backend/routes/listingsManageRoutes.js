const express = require('express');
const router = express.Router();
const listingManageController = require('../controllers/listingManageController');
// const { authenticate } = require('../middleware/authMiddleware');
const { ensureLandlordAuth } = require('../middleware/ensureLandlordAuth');

// Apply landlord authentication middleware to these routes
router.use(ensureLandlordAuth);

// Route to hold/un-hold a listing
router.post('/:listingId/hold', listingManageController.holdListing);

// Route to delete a listing
router.delete('/:listingId', listingManageController.deleteListing);

// Route to hold/un-hold a listing by admin
router.post('/admin/:listingId/hold', listingManageController.holdListingByAdmin);

// Route to delete a listing by admin
router.delete('/admin/:listingId', listingManageController.deleteListingByAdmin);

module.exports = router;
