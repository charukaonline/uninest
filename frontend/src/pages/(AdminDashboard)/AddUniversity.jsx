import React, { useState, useEffect } from "react";
import { Form, Input, notification } from "antd";
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Add University</h1>

        <ScrollArea className="h-[calc(100vh-150px)]">
          <Card>
            <CardHeader>
              <CardTitle>University Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* University Details */}
                  <div className="space-y-4">
                    <Form.Item
                      label={
                        <span className="text-base font-medium">
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
                        className="w-full h-10 focus:border-primaryBgColor hover:border-primaryBgColor"
                        placeholder="Enter university name"
                      />
                    </Form.Item>
                  </div>

                  {/* Map Section */}
                  <div className="space-y-4">
                    <p className="text-base font-medium mb-2">
                      Select Location on Map
                    </p>
                    <div className="h-[400px] w-full border rounded-lg overflow-hidden">
                      <Map
                        onLocationSelect={(loc) => setSelectedLocation(loc)}
                        selectedLocations={
                          selectedLocation ? [selectedLocation] : []
                        }
                        initialCenter={[6.9271, 79.8612]}
                        initialZoom={12}
                      />
                    </div>
                    {selectedLocation && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          Selected Location:{" "}
                          {selectedLocation.latitude.toFixed(6)},{" "}
                          {selectedLocation.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t mt-6">
                  <Button
                    type="submit"
                    className="bg-primaryBgColor hover:bg-primaryBgColor/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add University"}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AddUniversity;
