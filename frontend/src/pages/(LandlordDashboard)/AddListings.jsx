import AddListingStep01 from "@/components/landlord_dashboard/AddListingStep01";
import AddListingStep02 from "@/components/landlord_dashboard/AddListingStep02";
import Sidebar from "@/components/landlord_dashboard/Sidebar";
import { notification, Alert } from "antd";
import React, { useEffect, useState } from "react";
import { addListing } from "@/store/listingStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLandlordAuthStore } from "@/store/landlordAuthStore";

const AddListings = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const { landlord } = useLandlordAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 1) {
      document.title = "Add Listing details";
    } else if (step === 2) {
      document.title = "Add Location";
    }

    // Check if user has reached their listing limit
    const checkListingLimit = async () => {
      if (!landlord || !landlord._id) return;

      try {
        setIsCheckingLimit(true);
        // Get landlord's listings count
        const listingsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/listings/landlord/${
            landlord._id
          }`
        );

        // Get subscription status
        const subscriptionResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/subscription/${landlord._id}`
        );

        const listings = listingsResponse.data || [];
        const isPremium = subscriptionResponse.data.planType === "premium";

        // If free plan and already has a listing, show limit reached message
        if (!isPremium && listings.length >= 1) {
          setLimitReached(true);
        }
      } catch (error) {
        console.error("Error checking listing limit:", error);
      } finally {
        setIsCheckingLimit(false);
      }
    };

    checkListingLimit();
  }, [landlord, step]);

  const handleFirstStep = async (values) => {
    try {
      setFormData(values);
      notification.success({
        message: "First step completed",
        description: "Please complete your listing details.",
      });
      setStep(2);
    } catch (error) {
      notification.error({
        message: "Add Listing details failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleSecondStep = async (values) => {
    try {
      const finalFormData = new FormData();
      const combinedData = { ...formData, ...values };

      // Debug
      console.log("Step 1 data:", formData);
      console.log("Step 2 data:", values);

      // Handle property images first
      if (formData.propertyImages) {
        const imageFiles = formData.propertyImages;
        imageFiles.forEach((file, index) => {
          console.log(`Processing image ${index}:`, file);
          finalFormData.append("propertyImages", file.originFileObj);
        });
      }

      // Handle all other fields
      Object.keys(combinedData).forEach((key) => {
        if (key === "coordinates") {
          finalFormData.append(
            "coordinates",
            JSON.stringify(combinedData[key])
          );
        } else if (key !== "propertyImages") {
          // Skip propertyImages as we handled it above
          finalFormData.append(key, combinedData[key]);
        }
      });

      // Verify FormData contents
      console.log("Final FormData contents:");
      for (let [key, value] of finalFormData.entries()) {
        console.log(key, ":", value);
      }

      const response = await addListing(finalFormData);
      console.log("Server response:", response);

      notification.success({
        message: "Listing added successfully",
        description: "Your listing is now live.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Full error:", error);
      notification.error({
        message: "Add Listing failed",
        description:
          error.response?.data?.message ||
          "Failed to upload images. Please try again.",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div>
        <Sidebar />
      </div>

      <div
        style={{ marginLeft: "220px", marginTop: "-15px" }}
        className="w-full"
      >
        {limitReached ? (
          <div className="p-8 max-w-[1400px] mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Alert
                message="Listing Limit Reached"
                description={
                  <div>
                    <p className="mb-4">
                      Free plan users can only create 1 listing. Please upgrade
                      to Premium plan for unlimited listings.
                    </p>
                    <button
                      onClick={() => navigate("/landlord/pricing")}
                      className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Upgrade Now
                    </button>
                  </div>
                }
                type="warning"
                showIcon
              />
            </div>
          </div>
        ) : (
          <>
            {step === 1 && <AddListingStep01 onFinish={handleFirstStep} />}
            {step === 2 && <AddListingStep02 onFinish={handleSecondStep} />}
          </>
        )}
      </div>
    </div>
  );
};

export default AddListings;
