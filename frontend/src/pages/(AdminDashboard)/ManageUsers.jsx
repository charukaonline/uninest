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
import { Users } from "lucide-react";

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

  const handleFlagUser = async (userId) => {
    // Find the current user to determine their current flag status
    const user = allUsers.find(user => user._id === userId);
    if (!user) return;

    const updatedUsers = allUsers.map(u =>
      u._id === userId ? { ...u, isFlagged: !u.isFlagged } : u
    );
    useAdminStore.setState({ allUsers: updatedUsers });

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/toggle-user-flag/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        notification.success({
          message: response.data.user.isFlagged ? "Account Suspended" : "Account Restored",
          description: response.data.user.isFlagged
            ? `${response.data.user.username}'s account has been suspended`
            : `${response.data.user.username}'s account has been restored`,
          duration: 4,
        });

        const finalUpdatedUsers = allUsers.map(u =>
          u._id === userId ? { ...u, isFlagged: response.data.user.isFlagged } : u
        );
        useAdminStore.setState({ allUsers: finalUpdatedUsers });
      }
    } catch (error) {
      // Revert the optimistic update if there was an error
      useAdminStore.setState({ allUsers: allUsers });

      notification.error({
        message: "Action Failed",
        description: error.response?.data?.message || "Failed to update user status",
        duration: 4,
      });
    }
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
    <div className="flex">

      <div><Sidebar /></div>

      <div style={{ marginLeft: '230px' }} className=" w-full">
        <div className="flex-1 p-8 overflow-hidden flex flex-col">

          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
            <Users className="text-primaryBgColor mr-3 text-2xl" />
            Manage Users
          </h1>

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

                {/* <ScrollArea className="h-[calc(100vh-150px)]"> */}
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

                      <>

                        <Card key={landlord._id} className="mb-4 overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-shadow bg-gradient-to-r from-amber-50 to-white">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                              {/* Profile Picture Section */}
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-200 shadow-md mb-2">
                                  {landlord?.profilePicture ? (
                                    <img
                                      src={landlord.profilePicture}
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-600 text-white text-3xl font-bold">
                                      {landlord?.email ? landlord.email[0].toUpperCase() : "?"}
                                    </div>
                                  )}
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-200 text-amber-800 border border-amber-300 shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Pending Verification
                                </span>
                              </div>

                              {/* User Information Section */}
                              <div className="flex-grow">
                                <div className="mb-2 flex items-center space-x-3">
                                  <h3 className="text-xl font-bold text-gray-800">{landlord?.username || "Unknown"}</h3>
                                  <p className="text-sm text-gray-600">{landlord?.email}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 mb-4 bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                                  <div className="flex items-center">
                                    <div className="w-28 text-gray-600 text-sm font-medium flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                      </svg>
                                      NIC:
                                    </div>
                                    <span className="font-medium text-gray-800">{landlord?.nationalIdCardNumber}</span>
                                  </div>

                                  <div className="flex items-center">
                                    <div className="w-28 text-gray-600 text-sm font-medium flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      Phone:
                                    </div>
                                    <span className="font-medium text-gray-800">{landlord?.phoneNumber || "Not provided"}</span>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="w-28 text-gray-600 text-sm font-medium flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                      </svg>
                                      Address:
                                    </div>
                                    <span className="font-medium text-gray-800">{landlord?.residentialAddress}</span>
                                  </div>
                                </div>

                                {/* Actions Section */}
                                <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-gray-200">
                                  <div>
                                    {landlord?.verificationDocuments?.length > 0 && (
                                      <Button
                                        onClick={() =>
                                          viewDocument(
                                            landlord.verificationDocuments[0]?.driveFileId
                                          )
                                        }
                                        variant="outline"
                                        className="bg-[#181818] text-white border-amber-300 hover:bg-black hover:text-white"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View NIC Document
                                      </Button>
                                    )}
                                  </div>
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => handleApprove(landlord.userId)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleReject(landlord.userId)}
                                      variant="destructive"
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ))
                  )}

                </div>
                {/* </ScrollArea> */}

              </div>
            </TabsContent>

            <TabsContent value="all-users">
              <Card>
                <CardContent className="p-4">
                  {/* <ScrollArea className="h-[calc(100vh-200px)]"> */}
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
                        <TableRow
                          key={user._id}
                          className={user.isFlagged ? "bg-red-50" : ""}
                        >
                          <TableCell className={`font-medium ${user.isFlagged ? "text-red-600" : ""}`}>
                            {user.username}
                            {user.isFlagged && (
                              <span className="ml-2 text-xs bg-red-100 text-red-800 py-1 px-2 rounded-full">
                                Suspended
                              </span>
                            )}
                          </TableCell>
                          <TableCell className={user.isFlagged ? "text-red-600" : ""}>
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={user.role} />
                          </TableCell>
                          <TableCell className={user.isFlagged ? "text-red-600" : ""}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="default"
                              size="sm"
                              className={user.isFlagged ? "bg-red-500" : "bg-orange-500"}
                              onClick={() => handleFlagUser(user._id)}
                            >
                              {user.isFlagged ? "Unflag" : "Flag"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* </ScrollArea> */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
