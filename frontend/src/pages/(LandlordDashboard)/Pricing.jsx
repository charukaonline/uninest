import Sidebar from "@/components/landlord_dashboard/Sidebar";
import React, { useState, useEffect } from "react";
import { IoPricetags } from "react-icons/io5";
import { FaCheck, FaClock } from "react-icons/fa";
import { notification, Spin, Alert, Tag } from "antd";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "react-router-dom";

const Pricing = () => {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const { user } = useAuthStore();
  const location = useLocation();

  // Premium plan price in LKR
  const PREMIUM_PRICE = 2500;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success") === "true") {
      notification.success({
        message: "Payment Successful",
        description:
          "Your premium subscription has been activated successfully!",
      });
    } else if (params.get("cancelled") === "true") {
      notification.info({
        message: "Payment Cancelled",
        description:
          "You cancelled the payment process. Your plan remains unchanged.",
      });
    }
  }, [location]);

  useEffect(() => {
    // Fetch current subscription data when component mounts
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/subscription/${user._id}`
        );
        setSubscriptionData(response.data);
        setCurrentPlan(response.data.planType || "free");
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        notification.error({
          message: "Error",
          description: "Failed to load subscription information",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchSubscriptionData();
    }
  }, [user]);

  const handleSubscriptionAction = async () => {
    try {
      setLoading(true);

      // Different endpoint for new subscription vs renewal
      const endpoint =
        currentPlan === "premium"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/subscription/renew`
          : `${import.meta.env.VITE_BACKEND_URL}/api/subscription/create-order`;

      const response = await axios.post(endpoint, {
        userId: user._id,
        planType: "premium",
        amount: PREMIUM_PRICE,
      });

      // Instead of redirecting, create and submit a form
      if (
        response.data &&
        response.data.checkoutUrl &&
        response.data.formData
      ) {
        const { checkoutUrl, formData } = response.data;

        // Create a form element
        const form = document.createElement("form");
        form.method = "POST";
        form.action = checkoutUrl;
        form.style.display = "none"; // Hide the form

        // Add form fields
        Object.entries(formData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        // Add form to document body
        document.body.appendChild(form);

        // Submit the form
        form.submit();
      } else {
        throw new Error("Invalid payment data received from server");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      notification.error({
        message: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
      });
      setLoading(false);
    }
  };

  const formatNextBillingDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if subscription is expiring soon (within 7 days)
  const isExpiringSoon = subscriptionData?.daysUntilExpiration <= 7;

  if (loading) {
    return (
      <div className="flex h-full bg-gray-100 min-h-screen justify-center items-center">
        <Spin size="large" tip="Loading subscription data..." />
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-100 min-h-screen">
      <Sidebar className="fixed h-full" />

      <div className="flex-1 ml-[220px] p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <IoPricetags className="mr-2 text-primaryBgColor" />
            Pricing
          </h1>
          <p className="mb-6">
            Choose the plan that fits your needs. Get started today!
          </p>
        </div>

        {/* Subscription status alert */}
        {currentPlan === "premium" && isExpiringSoon && (
          <Alert
            message="Subscription Expiring Soon"
            description={
              <div>
                <p>
                  Your premium subscription will expire in{" "}
                  {subscriptionData.daysUntilExpiration} days. Renew now to
                  continue enjoying premium benefits.
                </p>
                <button
                  onClick={handleSubscriptionAction}
                  className="mt-2 px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Renew Now"}
                </button>
              </div>
            }
            type="warning"
            showIcon
            icon={<FaClock />}
            className="mb-6"
          />
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
              currentPlan === "free"
                ? "border-primaryBgColor"
                : "border-transparent"
            }`}
          >
            {currentPlan === "free" && (
              <div className="bg-primaryBgColor text-white text-center py-1 text-sm font-medium">
                Current Plan
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Free Plan</h3>
              <p className="text-gray-600 mb-4">
                Perfect for landlords starting out
              </p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">Rs 0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>List up to 1 property</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Basic analytics</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Email support</span>
                </div>
              </div>

              <button
                className="w-full py-2 rounded-md bg-gray-200 text-gray-700"
                disabled={true}
              >
                Current Plan
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div
            className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
              currentPlan === "premium"
                ? "border-primaryBgColor"
                : "border-transparent"
            }`}
          >
            {currentPlan === "premium" && (
              <div className="bg-primaryBgColor text-white text-center py-1 text-sm font-medium">
                Current Plan
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
              <p className="text-gray-600 mb-4">For professional landlords</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold">
                  Rs {PREMIUM_PRICE.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Unlimited properties</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Featured listings</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Custom branding</span>
                </div>
              </div>

              <button
                onClick={handleSubscriptionAction}
                className={`w-full py-2 rounded-md ${
                  currentPlan === "premium" && !isExpiringSoon
                    ? "bg-gray-200 text-gray-700"
                    : "bg-primaryBgColor text-white hover:bg-opacity-90 transition"
                }`}
                disabled={
                  (currentPlan === "premium" && !isExpiringSoon) || loading
                }
              >
                {loading
                  ? "Processing..."
                  : currentPlan === "premium"
                  ? isExpiringSoon
                    ? "Renew Subscription"
                    : "Current Plan"
                  : "Upgrade Now"}
              </button>

              {currentPlan === "premium" && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  <span className="font-medium">Note:</span> This is a one-time
                  payment for 30 days. You'll need to manually renew before
                  expiration.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
          {subscriptionData ? (
            <>
              <p className="text-gray-600">
                Your current plan:{" "}
                <span className="font-medium capitalize">{currentPlan}</span>
                {currentPlan === "premium" && (
                  <Tag
                    color={isExpiringSoon ? "orange" : "green"}
                    className="ml-2"
                  >
                    {isExpiringSoon
                      ? `Expires in ${subscriptionData.daysUntilExpiration} days`
                      : "Active"}
                  </Tag>
                )}
              </p>
              {currentPlan === "premium" && (
                <p className="text-gray-600 mt-2">
                  Expiration date:{" "}
                  <span className="font-medium">
                    {formatNextBillingDate(subscriptionData?.nextBillingDate)}
                  </span>
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-600">No active subscription</p>
          )}
          <p className="text-gray-600 mt-4">
            <span className="font-medium">Subscription details:</span> Premium
            subscriptions are valid for 30 days. You will be notified 3 days
            before expiration to manually renew your subscription.
          </p>
          <p className="text-gray-600 mt-2">
            Need help?{" "}
            <a href="#" className="text-primaryBgColor">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
