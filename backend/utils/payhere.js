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

function getPaymentUrl(orderId, user, amount, landlordParams = {}) {
  // Ensure we have full absolute URLs with protocol
  const baseUrl = process.env.BACKEND_URL.startsWith("http")
    ? process.env.BACKEND_URL
    : `http://${process.env.BACKEND_URL}`;

  // Add landlord parameters to return and cancel URLs if provided
  const landlordQueryParams =
    landlordParams.landlordId && landlordParams.email
      ? `?landlordId=${landlordParams.landlordId}&email=${encodeURIComponent(
          landlordParams.email
        )}&order_id=${orderId}`
      : `?order_id=${orderId}`;

  // Determine if this is a renewal from order_id format
  const isRenewal = orderId.includes("-RNW-");
  const itemName = isRenewal
    ? "Landlord Premium Subscription Renewal (30 days)"
    : "Landlord Premium Subscription (30 days)";

  const data = {
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: `${baseUrl}/api/subscription/success${landlordQueryParams}`,
    cancel_url: `${baseUrl}/api/subscription/cancel${landlordQueryParams}`,
    notify_url: `${baseUrl}/api/subscription/notify`,
    order_id: orderId,
    items: itemName,
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
    custom_1: isRenewal ? "renewal" : "new_subscription",
    custom_2: user.email,
  };

  // Instead of constructing a URL, return the payment data and checkout URL
  return {
    checkoutUrl: PAYHERE_BASE,
    formData: data,
  };
}

module.exports = { getPaymentUrl };
