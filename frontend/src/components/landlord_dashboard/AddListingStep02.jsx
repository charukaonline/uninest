import React, { useEffect, useState } from "react";
import { Form, Input, Select, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Map from "../include/Map";

const AddListingStep02 = ({ onFinish, initialValues }) => {
  const [form] = Form.useForm();
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.coordinates) {
        setSelectedCoordinates(initialValues.coordinates);
      }
    }
  }, [initialValues, form]);

  const handleLocationSelect = (coords) => {
    setSelectedCoordinates(coords);
    // Update form coordinates field
    form.setFieldsValue({
      coordinates: coords,
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form submission failed: ", errorInfo);
  };

  const handleSubmit = (values) => {
    if (!selectedCoordinates) {
      notification.error({
        message: "Location Required",
        description: "Please select a location on the map",
      });
      return;
    }

    // Ensure coordinates are numbers
    const formData = {
      ...values,
      coordinates: {
        latitude: parseFloat(selectedCoordinates.latitude),
        longitude: parseFloat(selectedCoordinates.longitude)
      }
    };
    onFinish(formData);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
      <Form
        form={form}
        name="add-listing-step-02"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className="max-w-[1400px] mx-auto"
        initialValues={initialValues}
      >
        <div className="w-full">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8 border-b pb-4">
              Add House Location
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-6">
              {/* First Column */}
              <div className="space-y-4">
                <Form.Item
                  label={<span className="text-base font-medium">Address</span>}
                  name="address"
                  rules={[{ required: true, message: "Please enter address!" }]}
                >
                  <Input
                    className="w-full h-10 focus:border-primaryBgColor hover:border-primaryBgColor"
                    placeholder="Enter boarding house address"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-base font-medium">City</span>}
                  name="city"
                  rules={[{ required: true, message: "Please enter city!" }]}
                >
                  <Input
                    className="w-full h-10 focus:border-primaryBgColor hover:border-primaryBgColor"
                    placeholder="Enter belonging city"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-base font-medium">
                      State/Province
                    </span>
                  }
                  name="province"
                  rules={[
                    { required: true, message: "Please enter province!" },
                  ]}
                >
                  <Input
                    className="w-full h-10"
                    placeholder="Western Province"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-base font-medium">
                      Zip/Postal Code
                    </span>
                  }
                  name="postalCode"
                >
                  <Input
                    className="w-full h-10"
                    placeholder="Boarding house postal code"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-base font-medium">
                      Which university is near the dormitory?
                    </span>
                  }
                  name="nearestUniversity" // Changed from "nearest-university"
                  rules={[
                    {
                      required: true,
                      message: "Please enter nearest university!",
                    },
                  ]}
                >
                  <Input
                    className="w-full h-10"
                    placeholder="University Proximity (km)"
                  />
                </Form.Item>
              </div>

              {/* Second Column */}
              <div className="space-y-4 w-full">
                {/* Map here */}
                <Form.Item
                  label={
                    <span className="text-base font-medium">
                      Select dormitory location on Map
                    </span>
                  }
                  name="coordinates"
                  rules={[
                    {
                      required: true,
                      message: "Please select a location on the map!",
                      validator: (_, value) => {
                        if (!selectedCoordinates) {
                          return Promise.reject(
                            "Please select a location on the map!"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <div className="h-[420px] w-full">
                    <Map
                      onLocationSelect={handleLocationSelect}
                      selectedLocations={
                        selectedCoordinates ? [selectedCoordinates] : []
                      }
                      initialCenter={[6.9271, 79.8612]}
                      initialZoom={12}
                    />
                    {selectedCoordinates && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          Selected Location:{" "}
                          {selectedCoordinates.latitude.toFixed(6)},{" "}
                          {selectedCoordinates.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </Form.Item>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end mt-8 pt-6 border-t gap-4">
              <button
                type="button"
                className="px-8 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                // onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-primaryBgColor text-white rounded-lg hover:bg-primaryBgColor/90 font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddListingStep02;
