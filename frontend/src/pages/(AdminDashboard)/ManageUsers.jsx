import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/admin_dashboard/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import LoadingSpinner from "@/components/include/LoadingSpinner";
import { notification } from "antd";

export default function ManageUsers() {
  const { adminId, email } = useParams();
  const [pendingLandlords, setPendingLandlords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLandlords();
  }, []);

  const fetchPendingLandlords = async () => {
    try {
      const response = await axios.get("/api/admin/pending-landlords", {
        withCredentials: true,
      });
      setPendingLandlords(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Error fetching pending landlords",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(
        `/api/admin/approve-landlord/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      notification.success({
        message: "Success",
        description: "Landlord approved successfully",
      });
      fetchPendingLandlords();
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Error approving landlord",
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
      fetchPendingLandlords();
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

  if (loading) {
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

        <Tabs defaultValue="pending-landlords">
          <TabsList>
            <TabsTrigger value="pending-landlords">
              Pending Landlords
            </TabsTrigger>
            <TabsTrigger value="all-users">All Users</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-landlords">
            <div className="grid gap-4">
              {pendingLandlords.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">
                      No pending landlord registrations
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingLandlords.map((landlord) => (
                  <Card key={landlord._id}>
                    <CardHeader>
                      <CardTitle>
                        {landlord.user?.fullName || "Unknown"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <p>Email: {landlord.user?.email}</p>
                        <p>NIC: {landlord.nationalIdCardNumber}</p>
                        <p>Address: {landlord.residentialAddress}</p>
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() =>
                              viewDocument(
                                landlord.verificationDocuments[0]?.driveFileId
                              )
                            }
                          >
                            View NIC Document
                          </Button>
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
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
