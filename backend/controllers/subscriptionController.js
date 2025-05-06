const Subscription = require("../models/Subscription");
const User = require("../models/User");
const LandlordProfile = require("../models/LandlordProfile");
const { getPaymentUrl } = require("../utils/payhere");
const nodemailer = require("nodemailer");

exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.params.userId,
    });

    // Check if subscription exists and has expired
    if (subscription && subscription.nextBillingDate) {
      const now = new Date();
      if (now > new Date(subscription.nextBillingDate)) {
        // Subscription has expired, return free plan status
        return res.json({
          planType: "free",
          expired: true,
          previousPlan: "premium",
          expirationDate: subscription.nextBillingDate,
        });
      }

      // Add days until expiration
      const daysUntilExpiration = Math.ceil(
        (new Date(subscription.nextBillingDate) - now) / (1000 * 60 * 60 * 24)
      );
      subscription._doc.daysUntilExpiration = daysUntilExpiration;
    }

    res.json(subscription || { planType: "free" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
};

exports.createOrder = async (req, res) => {
  const { userId, planType, amount } = req.body;

  if (planType !== "premium")
    return res.status(400).json({ message: "Invalid plan" });

  try {
    // Fetch real user data from DB
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = {
      firstName: userData.username || "User",
      lastName: "",
      email: userData.email,
      phone: userData.phoneNumber || "0771234567",
    };

    const orderId = `UN-${Date.now()}-${userId.slice(-4)}`;
    const paymentUrl = getPaymentUrl(orderId, user, amount);

    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.paymentNotify = async (req, res) => {
  const {
    order_id,
    status_code,
    md5sig,
    merchant_id,
    payment_id,
    payhere_amount,
    payhere_currency,
  } = req.body;

  // Signature validation (optional but recommended)
  // Update subscription if payment is successful
  if (status_code === "2") {
    try {
      const userId = order_id.split("-")[2]; // Extract user ID

      // Calculate expiration date (30 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      await Subscription.findOneAndUpdate(
        { userId },
        {
          planType: "premium",
          nextBillingDate: expirationDate,
        },
        { upsert: true }
      );

      // Also update the user's profile with subscription info
      const user = await User.findById(userId);
      if (user && user.role === "landlord") {
        await LandlordProfile.findOneAndUpdate(
          { userId },
          {
            "subscription.plan": "premium",
            "subscription.status": "active",
            "subscription.startDate": new Date(),
            "subscription.endDate": expirationDate,
          }
        );
      }

      // Send confirmation email
      await sendSubscriptionConfirmationEmail(userId);
    } catch (error) {
      console.error("Error processing payment notification:", error);
    }
  }

  res.status(200).send("OK");
};

exports.renewSubscription = async (req, res) => {
  const { userId, planType, amount } = req.body;

  if (planType !== "premium")
    return res.status(400).json({ message: "Invalid plan" });

  try {
    // Fetch real user data from DB
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = {
      firstName: userData.username || "User",
      lastName: "",
      email: userData.email,
      phone: userData.phoneNumber || "0771234567",
    };

    const orderId = `UN-RNW-${Date.now()}-${userId.slice(-4)}`;
    const paymentUrl = getPaymentUrl(orderId, user, amount);

    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Helper function to send subscription confirmation
async function sendSubscriptionConfirmationEmail(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "UniNest Premium Subscription Confirmation",
      html: `
        <h2>Thank you for subscribing to UniNest Premium!</h2>
        <p>Dear ${user.username},</p>
        <p>Your premium subscription has been activated successfully. You now have access to unlimited property listings and all premium features.</p>
        <p>Your subscription will expire in 30 days. We will send you a reminder 3 days before expiration.</p>
        <p>Thank you for choosing UniNest.</p>
        <p>Best regards,<br>The UniNest Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

// Function to check for expiring subscriptions and send notifications
// This should be called by a scheduled job
exports.checkExpiringSubscriptions = async () => {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Find subscriptions expiring in 3 days
    const expiringSubscriptions = await Subscription.find({
      planType: "premium",
      nextBillingDate: {
        $gte: new Date(),
        $lte: threeDaysFromNow,
      },
    });

    // Send notifications to each user
    for (const subscription of expiringSubscriptions) {
      await sendExpirationNotification(subscription.userId);
    }

    return { success: true, count: expiringSubscriptions.length };
  } catch (error) {
    console.error("Error checking expiring subscriptions:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to send expiration notification
async function sendExpirationNotification(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const subscription = await Subscription.findOne({ userId });
    if (!subscription) return;

    const expirationDate = new Date(subscription.nextBillingDate);
    const formattedDate = expirationDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your UniNest Premium Subscription is Expiring Soon",
      html: `
        <h2>Your Premium Subscription is Expiring Soon</h2>
        <p>Dear ${user.username},</p>
        <p>Your UniNest premium subscription will expire on <strong>${formattedDate}</strong>.</p>
        <p>To continue enjoying unlimited property listings and all premium features, please log in to your dashboard and renew your subscription.</p>
        <p><a href="${process.env.FRONTEND_URL}/landlord/pricing" style="background-color:#006845; color:white; padding:10px 15px; text-decoration:none; border-radius:5px; display:inline-block; margin-top:10px;">Renew Now</a></p>
        <p>If you choose not to renew, your account will be downgraded to the free plan with limited features.</p>
        <p>Thank you for choosing UniNest.</p>
        <p>Best regards,<br>The UniNest Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending expiration notification:", error);
  }
}

// Check if user has premium subscription
exports.checkListingLimit = async (userId) => {
  try {
    const subscription = await Subscription.findOne({ userId });

    // Check if subscription exists, is premium, and not expired
    if (subscription?.planType === "premium" && subscription.nextBillingDate) {
      const now = new Date();
      if (now <= new Date(subscription.nextBillingDate)) {
        return true; // Has valid premium subscription
      }
    }

    return false; // Free plan or expired premium
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
};
