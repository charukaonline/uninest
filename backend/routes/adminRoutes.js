// ...existing code...

// Add new routes for flagging/unflagging landlords
router.post("/flag-landlord/:landlordId", ensureAdminAuth, adminController.flagLandlord);
router.post("/unflag-landlord/:landlordId", ensureAdminAuth, adminController.unflagLandlord);

// ...existing code...
