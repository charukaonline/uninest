import React, { useEffect, useState } from "react";
import Sidebar from "@/components/admin_dashboard/Sidebar";
import { useAdminStore } from "@/store/adminStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  Building2,
  FileText,
  Calendar,
  Clock,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { IoMdAnalytics } from "react-icons/io";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "@/components/admin_dashboard/CountUp";

const Analytics = () => {
  const {
    userStats,
    listingStats,
    reportStats,
    reviewStats,
    scheduleStats,
    communicationStats,
    fetchDashboardStats,
    isLoading,
  } = useAdminStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = "UniNest Admin Analytics";
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Define color schemes for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];
  const greenGradient = ["#006845", "#00A86B"];

  // Transform data for charts
  const userRoleData = [
    { name: "Students", value: userStats.students },
    { name: "Landlords", value: userStats.landlords },
    { name: "Admins", value: userStats.admins },
  ];

  const propertyTypeData = Object.entries(
    listingStats.byPropertyType || {}
  ).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const cityDistribution = Object.entries(
    listingStats.cityDistribution || {}
  ).map(([city, count]) => ({
    name: city,
    value: count,
  }));

  const priceRanges = Object.entries(listingStats.priceRanges || {}).map(
    ([range, count]) => ({
      name: range,
      value: count,
    })
  );

  const reportTypeData = Object.entries(reportStats.byType || {}).map(
    ([type, count]) => ({
      name: type,
      value: count,
    })
  );

  const reviewSentimentData = [
    { name: "Positive", value: reviewStats.sentiments?.positive || 0 },
    { name: "Neutral", value: reviewStats.sentiments?.neutral || 0 },
    { name: "Negative", value: reviewStats.sentiments?.negative || 0 },
  ];

  const ratingDistributionData = Object.entries(
    reviewStats.ratingDistribution || {}
  ).map(([rating, count]) => ({
    name: `${rating} Star${rating === "1" ? "" : "s"}`,
    value: count,
  }));

  const popularDaysData = Object.entries(scheduleStats.popularDays || {}).map(
    ([day, count]) => ({
      name: day,
      value: count,
    })
  );

  const userGrowthData = Object.entries(userStats.monthlyGrowth || {}).map(
    ([month, count]) => ({
      name: month,
      value: count,
    })
  );

  const messageVolumeData = Object.entries(
    communicationStats.messaging?.messageVolumeTrend || {}
  ).map(([date, count]) => ({
    name: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: count,
  }));

  const notificationTypeData = Object.entries(
    communicationStats.notifications?.byType || {}
  ).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Chart configurations
  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--chart-1))",
    },
    listings: {
      label: "Listings",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="flex h-full bg-gray-100 min-h-screen">
      <div>
        <Sidebar />
      </div>

      <div style={{ marginLeft: "230px" }} className="flex-1 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <IoMdAnalytics className="text-primaryBgColor mr-3" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive platform statistics and trends
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            className="bg-primaryBgColor hover:bg-green-700"
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              User Analytics
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Listing Analytics
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
            >
              <Activity className="mr-2 h-4 w-4" />
              Engagement Analytics
            </TabsTrigger>
            <TabsTrigger
              value="communications"
              className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Communication Analytics
            </TabsTrigger>
          </TabsList>

          {/* USER ANALYTICS TAB */}
          <TabsContent value="users" className="space-y-6">
            {/* User Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primaryBgColor">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={userStats.total || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${((userStats.verified / userStats.total) * 100).toFixed(
                        1
                      )}% verified accounts`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={userStats.students || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${((userStats.students / userStats.total) * 100).toFixed(
                        1
                      )}% of all users`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Landlords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={userStats.landlords || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${(
                        (userStats.landlords / userStats.total) *
                        100
                      ).toFixed(1)}% of all users`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Flagged Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={userStats.flagged || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${((userStats.flagged / userStats.total) * 100).toFixed(
                        1
                      )}% of all users`
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly user registrations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={userGrowthData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorUsers"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#006845"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#006845"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#006845"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                          name="New Users"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Distribution & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Role Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
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
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>
                    Active users in different time periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Last 24h",
                              value: userStats.activity?.activeLast24h || 0,
                              rate: userStats.activity?.activeRate24h || 0,
                            },
                            {
                              name: "Last 7d",
                              value: userStats.activity?.activeLast7d || 0,
                              rate: userStats.activity?.activeRate7d || 0,
                            },
                            {
                              name: "Last 30d",
                              value: userStats.activity?.activeLast30d || 0,
                              rate: userStats.activity?.activeRate30d || 0,
                            },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name) =>
                              name === "rate" ? `${value}%` : value
                            }
                          />
                          <Legend />
                          <Bar
                            name="Active Users"
                            dataKey="value"
                            fill="#006845"
                          />
                          <Bar
                            name="Activity Rate (%)"
                            dataKey="rate"
                            fill="#8884d8"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Landlord Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Landlord Verification Status</CardTitle>
                <CardDescription>
                  Overview of landlord verification progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Pending",
                            value: userStats.landlordVerification?.pending || 0,
                          },
                          {
                            name: "Verified",
                            value:
                              userStats.landlordVerification?.verified || 0,
                          },
                          {
                            name: "Rejected",
                            value:
                              userStats.landlordVerification?.rejected || 0,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Landlords">
                          <Cell fill="#FFC107" />
                          <Cell fill="#4CAF50" />
                          <Cell fill="#F44336" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LISTING ANALYTICS TAB */}
          <TabsContent value="listings" className="space-y-6">
            {/* Listing Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primaryBgColor">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={listingStats.total || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${
                        listingStats.newListingsRate || 0
                      }% new in the last month`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Rent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      `LKR ${(listingStats.averageRent || 0).toLocaleString()}`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Per month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Most Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-xl font-bold text-blue-600 truncate"
                    title={listingStats.highestViewed?.propertyName}
                  >
                    {isLoading ? (
                      <Skeleton className="h-8 w-full" />
                    ) : (
                      listingStats.highestViewed?.propertyName || "N/A"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${listingStats.highestViewed?.views || 0} views`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average ELO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      (listingStats.averageElo || 0).toFixed(1)
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Visibility score
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Property Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Property Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of listings by property type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
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
                          outerRadius={100}
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
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* City & Price Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>City Distribution</CardTitle>
                  <CardDescription>Listings by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={cityDistribution}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#006845" name="Listings" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Range Distribution</CardTitle>
                  <CardDescription>
                    Listings by price range (LKR)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={priceRanges}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#FFC107" name="Listings" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ENGAGEMENT ANALYTICS TAB */}
          <TabsContent value="engagement" className="space-y-6">
            {/* Engagement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={reviewStats.total || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${reviewStats.spam || 0} flagged as spam`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500 flex items-center">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      reviewStats.averageRating || "0"
                    )}
                    <span className="text-yellow-500 ml-1">★</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Out of 5 stars
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={reportStats.total || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${reportStats.pending || 0} pending resolution`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Schedules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp end={scheduleStats.total || 0} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${scheduleStats.weeklyRate || 0} this week`
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Review Sentiment & Rating Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Sentiment</CardTitle>
                  <CardDescription>
                    Distribution of review sentiment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reviewSentimentData}
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
                            <Cell fill="#4CAF50" />
                            <Cell fill="#FFC107" />
                            <Cell fill="#F44336" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Reviews by star rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ratingDistributionData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#FFD700" name="Reviews" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report & Schedule Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports by Type</CardTitle>
                  <CardDescription>
                    Distribution of report reasons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportTypeData}
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
                            {reportTypeData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Visit Days</CardTitle>
                  <CardDescription>
                    Property viewing schedule by day of week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={popularDaysData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            fill="#006845"
                            name="Schedules"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Schedule and Report Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Status</CardTitle>
                  <CardDescription>
                    Breakdown of schedule statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Pending",
                                value: scheduleStats.pending || 0,
                              },
                              {
                                name: "Confirmed",
                                value: scheduleStats.confirmed || 0,
                              },
                              {
                                name: "Rejected",
                                value: scheduleStats.rejected || 0,
                              },
                            ]}
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
                            <Cell fill="#FFC107" />
                            <Cell fill="#4CAF50" />
                            <Cell fill="#F44336" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Status</CardTitle>
                  <CardDescription>
                    Current status of reported listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Pending",
                                value: reportStats.pending || 0,
                              },
                              {
                                name: "Investigating",
                                value: reportStats.investigating || 0,
                              },
                              {
                                name: "Resolved",
                                value: reportStats.resolved || 0,
                              },
                              {
                                name: "Dismissed",
                                value: reportStats.dismissed || 0,
                              },
                            ]}
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
                            <Cell fill="#FFC107" />
                            <Cell fill="#2196F3" />
                            <Cell fill="#4CAF50" />
                            <Cell fill="#F44336" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* COMMUNICATION ANALYTICS TAB */}
          <TabsContent value="communications" className="space-y-6">
            {/* Communications Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primaryBgColor">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp
                        end={
                          communicationStats.messaging?.totalConversations || 0
                        }
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total chat threads
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp
                        end={communicationStats.messaging?.totalMessages || 0}
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${
                        communicationStats.messaging?.recentMessages || 0
                      } in the last week`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <CountUp
                        end={communicationStats.notifications?.total || 0}
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `${
                        communicationStats.notifications?.readRate || 0
                      }% read rate`
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      communicationStats.messaging
                        ?.avgMessagesPerConversation || "0"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per conversation
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Message Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Message Volume</CardTitle>
                <CardDescription>
                  Daily message activity over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={messageVolumeData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorMsg"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#2196F3"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#2196F3"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#2196F3"
                          fillOpacity={1}
                          fill="url(#colorMsg)"
                          name="Messages"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notification Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Distribution of notifications by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={notificationTypeData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#9C27B0" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
