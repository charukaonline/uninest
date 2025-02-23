import React, { useEffect, useState } from "react";
import AddListingStep01 from "@/components/landlord_dashboard/AddListingStep01";
import AddListingStep02 from "@/components/landlord_dashboard/AddListingStep02";
import Sidebar from "@/components/landlord_dashboard/Sidebar";
import { notification } from "antd";
import axios from "axios";

const AddListings = () => {
  const [step, setStep] = useState(1);
  const [listingData, setListingData] = useState({
    step1: null,
    step2: null,
  });

  const handleFirstStep = (values) => {
    try {
      setListingData((prev) => ({
        ...prev,
        step1: values,
      }));
      notification.success({
        message: "First step completed",
        description: "Please complete location details.",
      });
      setStep(2);
    } catch (error) {
      notification.error({
        message: "Step 1 failed",
        description: error.message || "Something went wrong",
      });
    }
  };

  const handleSecondStep = async (values) => {
    try {
      const formData = new FormData();

      // Add step 1 data
      const step1Data = listingData.step1;
      Object.keys(step1Data).forEach((key) => {
        if (key === "propertyImages") {
          const files = step1Data[key].fileList;
          files.forEach((file) => {
            formData.append("images", file.originFileObj);
          });
        } else {
          // Convert property type value to string
          if (key === "propertyType") {
            const propertyTypes = {
              1: "Boarding House",
              2: "Apartment",
            };
            formData.append(key, propertyTypes[step1Data[key]]);
          } else {
            formData.append(key, step1Data[key]);
          }
        }
      });

      // Add step 2 data
      if (values.coordinates) {
        formData.append("coordinates[latitude]", values.coordinates.latitude);
        formData.append("coordinates[longitude]", values.coordinates.longitude);
      }
      // Add other step 2 fields
      [
        "address",
        "city",
        "province",
        "postalCode",
        "nearestUniversity",
      ].forEach((field) => {
        if (values[field]) {
          formData.append(field, values[field]);
        }
      });

      // Log formData for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        "http://localhost:5000/api/listings/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        notification.success({
          message: "Listing Created",
          description: "Your property listing has been created successfully.",
        });
        setStep(1);
        setListingData({ step1: null, step2: null });
      }
    } catch (error) {
      console.error("Form submission error:", error.response?.data || error);
      notification.error({
        message: "Failed to create listing",
        description: error.response?.data?.message || "Server error occurred",
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
        {step === 1 && (
          <AddListingStep01
            onFinish={handleFirstStep}
            initialValues={listingData.step1}
          />
        )}
        {step === 2 && (
          <AddListingStep02
            onFinish={handleSecondStep}
            initialValues={listingData.step2}
          />
        )}
      </div>
    </div>
  );
};

export default AddListings;
