import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/admin_dashboard/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notification } from "antd";
import LoadingSpinner from "@/components/include/LoadingSpinner";
import { useAdminStore } from "@/store/adminStore";

export default function ManageUsers() {
  const [currentTab, setCurrentTab] = useState("pending-landlords");
  const { adminId, email } = useParams();
  const { unverifiedLandlords, fetchUnverifiedLandlords, isLoading, error } = useAdminStore();

  useEffect(() => {
    const controller = new AbortController();
    
    // Initial fetch
    fetchUnverifiedLandlords(controller.signal);
    
    // Set up auto-refresh every 10 seconds
    const refreshInterval = setInterval(() => {
      fetchUnverifiedLandlords(controller.signal);
    }, 10000);

    // Cleanup function
    return () => {
      controller.abort();
      clearInterval(refreshInterval);
    };
  }, []);

  // Updated useEffect for dynamic title
  useEffect(() => {
    if (currentTab === "pending-landlords") {
      document.title = `We have (${unverifiedLandlords.length}) pending accounts`;
    } else {
      document.title = "User Management";
    }
  }, [currentTab, unverifiedLandlords.length]);

  const handleApprove = async (userId) => {
    try {
      await axios.post(
        `/api/admin/approve-landlord/${userId}`,
        {},
        { withCredentials: true }
      );
      notification.success({
        message: "Success",
        description: "Landlord approved successfully",
      });
      fetchUnverifiedLandlords();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error approving landlord",
      });
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `/api/admin/reject-landlord/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      notification.success({
        message: "Success",
        description: "Landlord rejected successfully",
      });
      fetchUnverifiedLandlords();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Error rejecting landlord",
      });
    }
  };

  const viewDocument = (driveFileId) => {
    if (!driveFileId) {
      notification.error({
        message: "Error",
        description: "Document ID not found",
      });
      return;
    }
    window.open(
      `https://drive.google.com/file/d/${driveFileId}/view`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

        <Tabs defaultValue="pending-landlords" onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger 
              value="pending-landlords"
              className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
            >
              Pending Landlords
            </TabsTrigger>
            <TabsTrigger 
              value="all-users"
              className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
            >
              All Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending-landlords">
            <div className="grid gap-4">
              {error && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-red-500">{error}</p>
                  </CardContent>
                </Card>
              )}

              {!error && unverifiedLandlords.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">
                      No pending landlord registrations
                    </p>
                  </CardContent>
                </Card>
              ) : (
                unverifiedLandlords.map((landlord) => (
                  <Card key={landlord._id}>
                    <CardHeader>
                      <div className=" flex space-x-2">
                        <CardTitle>
                          {landlord?.username || "Unknown"}
                        </CardTitle>
                        <p className=" font-semibold">({landlord?.email})</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <div className=" flex space-x-4">
                          <p className=" flex space-x-2"><p className=" text-gray-500">NIC:</p> <p className=" font-semibold">{landlord?.nationalIdCardNumber}</p></p>
                          <p className=" flex space-x-2"><p className=" text-gray-500">Phone:</p> <p className=" font-semibold">{landlord?.phoneNumber || "Not provided"}</p></p>
                          <p className=" flex space-x-2"><p className=" text-gray-500">Address:</p> <p className=" font-semibold">{landlord?.residentialAddress}</p></p>
                        </div>
                        <div className="flex gap-2 mt-4 justify-between">
                          <div>
                            {landlord?.verificationDocuments?.length > 0 && (
                              <Button
                                onClick={() =>
                                  viewDocument(
                                    landlord.verificationDocuments[0]?.driveFileId
                                  )
                                }
                              >
                                View NIC Document
                              </Button>
                            )}
                          </div>
                          <div className=" space-x-2">
                            <Button
                              onClick={() => handleApprove(landlord.userId)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(landlord.userId)}
                              variant="destructive"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="all-users">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">
                  All users will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
