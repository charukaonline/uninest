import React, { useState, useEffect } from "react";
import { Form, Input, notification } from "antd";
import { HomeOutlined, EnvironmentOutlined, BankOutlined } from "@ant-design/icons"; // Using Ant Design icons instead
import Map from "../../components/include/Map";
import Sidebar from "@/components/admin_dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";

const AddUniversity = () => {
  const [form] = Form.useForm();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { adminId, email } = useParams();

  useEffect(() => {
    document.title = "Add University";
  }, []);

  const onFinish = async (values) => {
    if (!selectedLocation) {
      notification.error({
        message: "Location Required",
        description: "Please select a location on the map",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-university`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            name: values.universityName,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: "Success",
          description: data.message || "University added successfully!",
        });
        form.resetFields();
        setSelectedLocation(null);
      } else {
        notification.error({
          message: "Error",
          description: data.message || "Failed to add university.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while adding the university.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[230px]">
        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
            <BankOutlined className="text-primaryBgColor mr-3 text-2xl" />
            Add New University
          </h1>

          <Card className="shadow-md border-0">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl text-primaryBgColor">University Information</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Add details about the university and select its location on the map</p>
            </CardHeader>
            <CardContent className="pt-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* University Details */}
                  <div className="space-y-6">
                    <Form.Item
                      label={
                        <span className="text-base font-medium flex items-center">
                          <BankOutlined className="text-primaryBgColor mr-2" />
                          University Name
                        </span>
                      }
                      name="universityName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the university name",
                        },
                      ]}
                    >
                      <Input
                        className="w-full h-12 rounded-md border-gray-300 focus:border-primaryBgColor hover:border-primaryBgColor"
                        placeholder="Enter university name"
                        size="large"
                      />
                    </Form.Item>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-medium text-green-800 mb-2">Location Instructions:</h3>
                      <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                        <li>Click on the map to set the university location</li>
                        <li>You can drag the marker to adjust the position</li>
                        <li>Zoom in for more precise placement</li>
                      </ul>
                    </div>
                    
                    {selectedLocation && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h3 className="text-sm font-medium text-green-800 flex items-center mb-2">
                          <EnvironmentOutlined className="mr-1" />
                          Selected Location:
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Latitude:</span>{" "}
                            <span className="text-green-700">{selectedLocation.latitude.toFixed(6)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Longitude:</span>{" "}
                            <span className="text-green-700">{selectedLocation.longitude.toFixed(6)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Map Section */}
                  <div className="space-y-4">
                    <p className="text-base font-medium mb-2 flex items-center">
                      <EnvironmentOutlined className="text-primaryBgColor mr-2" />
                      Select Location on Map
                    </p>
                    <div className="h-[400px] w-full border rounded-lg overflow-hidden shadow-inner">
                      <Map
                        onLocationSelect={(loc) => setSelectedLocation(loc)}
                        selectedLocations={
                          selectedLocation ? [selectedLocation] : []
                        }
                        initialCenter={[6.9271, 79.8612]}
                        initialZoom={12}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t mt-8">
                  <Button
                    type="submit"
                    className="bg-primaryBgColor hover:bg-primaryBgColor/90 text-white px-8 py-6 h-auto text-base font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding University...
                      </>
                    ) : (
                      <>
                        <BankOutlined className="mr-2" />
                        Add University
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddUniversity;
