import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/include/LoadingSpinner";
import Sidebar from "@/components/admin_dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  MessageSquare,
  AlertTriangle,
  Activity,
  Star,
  Calendar,
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import CountUp from "@/components/admin_dashboard/CountUp";
import useListingStore from "@/store/listingStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminId, email } = useParams();
  const {
    admin,
    isAdminAuthenticated,
    adminLogout,
    isCheckingAdminAuth,
    checkAdminAuth,
  } = useAdminAuthStore();

  const {
    allUsers,
    fetchAllUsers,
    userStats,
    listingStats,
    reportStats,
    reviewStats,
    scheduleStats,
    fetchDashboardStats,
    isLoading,
  } = useAdminStore();

  const { listings, fetchAllListings } = useListingStore();
  const [activeTab, setActiveTab] = useState("overview");

  const handlePagesButtonClick = () => {
    try {
      navigate(`/admin/${adminId}/${email}/handle-pages`);
    } catch (error) {
      console.error("Error navigating to pages:", error);
    }
  };

  useEffect(() => {
    if (!isAdminAuthenticated && !isCheckingAdminAuth) {
      checkAdminAuth();
    }
  }, [isAdminAuthenticated, isCheckingAdminAuth, checkAdminAuth]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAllUsers();
      fetchAllListings();
      fetchDashboardStats();
    }
  }, [
    isAdminAuthenticated,
    fetchAllUsers,
    fetchAllListings,
    fetchDashboardStats,
  ]);

  useEffect(() => {
    if (admin?.username) {
      document.title = `${admin.username}'s Dashboard`;
    }
  }, [admin?.username]);

  if (isCheckingAdminAuth || isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdminAuthenticated || !admin) {
    navigate("/auth/uninest-admin");
    return null;
  }

  // Prepare property type data for chart
  const propertyTypeData = Object.entries(
    listingStats.byPropertyType || {}
  ).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Prepare user role data for chart
  const userRoleData = [
    { name: "Students", value: userStats.students },
    { name: "Landlords", value: userStats.landlords },
  ];

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const statsCards = [
    {
      title: "Total Users",
      value: `${userStats.total}`,
      icon: Users,
      description: `${userStats.students} students, ${userStats.landlords} landlords`,
    },
    {
      title: "Total Listings",
      value: `${listings.length}`,
      icon: Building2,
      description: `Avg. rent: LKR ${
        listingStats.averageRent?.toLocaleString() || 0
      }`,
    },
    {
      title: "Reviews",
      value: `${reviewStats.total || 0}`,
      icon: Star,
      description: `${reviewStats.spam || 0} flagged as spam`,
    },
    {
      title: "Reports",
      value: `${reportStats.total || 0}`,
      icon: AlertTriangle,
      description: `${reportStats.pending || 0} pending resolution`,
    },
  ];

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>

      <div style={{ marginLeft: "230px" }} className="w-full">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold">
              Welcome Back, {admin.username}
            </h1>
            <Button
              onClick={handlePagesButtonClick}
              variant="outline"
              className="bg-primaryBgColor text-white hover:bg-green-700 hover:text-white"
            >
              Manage Pages
            </Button>
          </div>
        </header>

        <main className="p-8">
          {/* Dashboard Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "overview"
                  ? "bg-primaryBgColor text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "users"
                  ? "bg-primaryBgColor text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveTab("users")}
            >
              User Analytics
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === "listings"
                  ? "bg-primaryBgColor text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => setActiveTab("listings")}
            >
              Listing Analytics
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <Card key={index} className="bg-primaryBgColor text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-5 w-5 text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <CountUp end={parseInt(card.value) || 0} />
                  </div>
                  <p className="text-xs text-gray-200">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Stats Card */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primaryBgColor" />
                    Platform Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>New Users (Last 7 days)</span>
                      <span className="font-bold">
                        {
                          allUsers.filter(
                            (u) =>
                              new Date(u.createdAt) >
                              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Scheduled Visits</span>
                      <span className="font-bold">
                        {scheduleStats.total || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Approvals</span>
                      <span className="font-bold">
                        {scheduleStats.pending || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>User Verification Rate</span>
                      <span className="font-bold">
                        {userStats.total
                          ? Math.round(
                              (userStats.verified / userStats.total) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Status Card */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primaryBgColor" />
                    Visit Scheduling Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Pending", value: scheduleStats.pending || 0 },
                        {
                          name: "Confirmed",
                          value: scheduleStats.confirmed || 0,
                        },
                        {
                          name: "Rejected",
                          value: scheduleStats.rejected || 0,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "users" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Role Distribution */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    User Role Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Stats Card */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    User Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Users</span>
                      <span className="font-bold">{userStats.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Students</span>
                      <span className="font-bold">{userStats.students}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Landlords</span>
                      <span className="font-bold">{userStats.landlords}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Verified Users</span>
                      <span className="font-bold">{userStats.verified}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Flagged Users</span>
                      <span className="font-bold">{userStats.flagged}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "listings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Property Type Distribution */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Property Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Listing Stats Card */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Listing Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Listings</span>
                      <span className="font-bold">{listings.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Monthly Rent</span>
                      <span className="font-bold">
                        LKR {listingStats.averageRent?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Most Viewed Property</span>
                      <span className="font-bold">
                        {listingStats.highestViewed?.propertyName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Property with Most Bookmarks</span>
                      <span className="font-bold">
                        {listingStats.mostBookmarked?.propertyName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average ELO Rating</span>
                      <span className="font-bold">
                        {listingStats.averageElo?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
