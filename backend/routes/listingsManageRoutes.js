const express = require('express');
const router = express.Router();
const listingManageController = require('../controllers/listingManageController');
// const { authenticate } = require('../middleware/authMiddleware');
const { ensureLandlordAuth } = require('../middleware/ensureLandlordAuth');

// Apply landlord authentication middleware to these routes
router.use(ensureLandlordAuth);

// Route to hold/unhold a listing
router.post('/:listingId/hold', listingManageController.holdListing);

// Route to delete a listing
router.delete('/:listingId', listingManageController.deleteListing);

module.exports = router;
