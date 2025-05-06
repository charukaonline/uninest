const crypto = require("crypto");
const env = require("dotenv").config();

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_SECRET = process.env.PAYHERE_SECRET_KEY;
const PAYHERE_BASE = "https://sandbox.payhere.lk/pay/checkout";

function generateHash(orderId, amount, currency) {
  const localMd5 = crypto
    .createHash("md5")
    .update(PAYHERE_SECRET)
    .digest("hex")
    .toUpperCase();

  const rawString = `${PAYHERE_MERCHANT_ID}${orderId}${amount}${currency}${localMd5}`;
  const hash = crypto
    .createHash("md5")
    .update(rawString)
    .digest("hex")
    .toUpperCase();

  return hash;
}

function getPaymentUrl(orderId, user, amount) {
  const data = {
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: "http://localhost:5000/api/subscription/success",
    cancel_url: "http://localhost:5000/api/subscription/cancel",
    notify_url: "http://localhost:5000/api/subscription/notify",
    order_id: orderId,
    items: "Landlord Premium Subscription (30 days)",
    currency: "LKR",
    amount: amount.toFixed(2),
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    phone: user.phone || "0770000000",
    address: "UniNest Subscription",
    city: "Colombo",
    country: "Sri Lanka",
    hash: generateHash(orderId, amount.toFixed(2), "LKR"),
  };

  // Instead of constructing a URL, return the payment data and checkout URL
  return {
    checkoutUrl: PAYHERE_BASE,
    formData: data,
  };
}

module.exports = { getPaymentUrl };
