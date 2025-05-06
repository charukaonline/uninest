const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriptionController");
const { ensureLandlordAuth } = require("../middleware/ensureLandlordAuth");
const { verifyToken } = require("../middleware/verifyToken"); // Use the correct middleware

router.get("/:userId", controller.getSubscription);
router.post("/create-order", controller.createOrder);
router.post("/renew", ensureLandlordAuth, controller.renewSubscription);
router.post("/notify", controller.paymentNotify);
router.get("/success", (req, res) =>
  res.redirect(`${process.env.FRONTEND_URL}/landlord/pricing?success=true`)
);
router.get("/cancel", (req, res) =>
  res.redirect(`${process.env.FRONTEND_URL}/landlord/pricing?cancelled=true`)
);

// Admin route to manually check for expiring subscriptions
router.post("/check-expiring", verifyToken, async (req, res) => {
  try {
    // Check if user is admin before allowing access
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const result = await controller.checkExpiringSubscriptions();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
