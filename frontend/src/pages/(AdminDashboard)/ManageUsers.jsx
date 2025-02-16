import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/admin_dashboard/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notification } from "antd";
import LoadingSpinner from "@/components/include/LoadingSpinner";
import { useAdminStore } from "@/store/adminStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const RoleBadge = ({ role }) => {
  const roleStyles = {
    landlord: "bg-purple-100 text-blue-800 border-purple-200",
    user: "bg-blue-100 text-green-800 border-blue-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${roleStyles[role]
        }`}
    >
      {role}
    </span>
  );
};

export default function ManageUsers() {
  const [currentTab, setCurrentTab] = useState("pending-landlords");
  const { adminId, email } = useParams();
  const {
    unverifiedLandlords,
    fetchUnverifiedLandlords,
    shouldRefresh,
    setShouldRefresh,
    isLoading,
    error,
    allUsers,
    fetchAllUsers,
  } = useAdminStore();

  // Effect for title update
  useEffect(() => {
    if (currentTab === "pending-landlords") {
      document.title = `Review Needed For (${unverifiedLandlords.length})`;
    } else {
      document.title = `(${allUsers.length}) Verify Members`;
    }
  }, [currentTab, unverifiedLandlords.length, allUsers.length]);

  useEffect(() => {
    const controller = new AbortController();

    // Initial fetch
    fetchUnverifiedLandlords(controller.signal);
    fetchAllUsers(controller.signal);

    let refreshInterval;
    if (shouldRefresh) {
      refreshInterval = setInterval(() => {
        fetchUnverifiedLandlords(controller.signal);
      }, 3000);
    }

    return () => {
      controller.abort();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [shouldRefresh]);

  useEffect(() => {
    if (currentTab === "pending-landlords") {
      setShouldRefresh(true);
    } else {
      setShouldRefresh(false);
    }
  }, [currentTab]);

  const handleApprove = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/approve-landlord/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: "Landlord approved successfully",
        });
        // Refresh the landlords list
        fetchUnverifiedLandlords();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error approving landlord",
      });
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/reject-landlord/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: "Landlord rejected successfully",
        });
        // Refresh the landlords list
        fetchUnverifiedLandlords();
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error rejecting landlord",
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
        <div className="flex-1 flex items-center justify-center ">
          {/* <LoadingSpinner /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-hidden flex flex-col">
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

          <TabsContent value="pending-landlords" className="flex-1">
            <div className="grid gap-4 h-full">
              {error && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-red-500">{error}</p>
                  </CardContent>
                </Card>
              )}

              <ScrollArea className="h-[calc(100vh-150px)]">
                <div className="space-y-4 p-1">
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
                        <CardHeader className=" -mb-5">
                          <div className=" flex space-x-2">
                            <CardTitle>
                              {landlord?.username || "Unknown"}
                            </CardTitle>
                            <p className=" font-semibold">({landlord?.email})</p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <TableHeader>
                            <TableRow>
                              <TableHead>NIC</TableHead>
                              <TableHead>Contact Number</TableHead>
                              <TableHead>Address</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">
                                {landlord?.nationalIdCardNumber}
                              </TableCell>
                              <TableCell>
                                {landlord?.phoneNumber || "Not provided"}
                              </TableCell>
                              <TableCell>
                                {landlord?.residentialAddress}
                              </TableCell>
                            </TableRow>
                          </TableBody>

                          <div className="grid gap-2">
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
              </ScrollArea>

            </div>
          </TabsContent>

          <TabsContent value="all-users">
            <Card>
              <CardContent className="p-4">
                <Table>
                  <TableCaption className=" text-center">A list of all verified users.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="default"
                            size="sm"
                            className=" bg-orange-500"
                          >
                            Flag
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
