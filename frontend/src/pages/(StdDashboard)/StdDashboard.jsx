import LoadingSpinner from "@/components/include/LoadingSpinner";
import StudentSidebar from "@/components/student_dashboard/StudentSidebar";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Tooltip } from "antd";
import Map from "@/components/include/Map";

import { useEffect, useState } from "react";
import PopularCard from "@/components/student_dashboard/PopularCard";

export default function StudentDashboard() {
  const [isMapView, setIsMapView] = useState(false);

  const { user, isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, []);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const documentTitles = [
    `${user?.username}'s Dashboard`,
    "Check New Listings",
    "Explore Nearby Places"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % documentTitles.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    document.title = documentTitles[currentIndex];
  }, [currentIndex]);

  return (
    <>
      <div className="flex bg-white">

        <div><StudentSidebar /></div>

        <div style={{ marginLeft: '210px', padding: '1rem' }} className=" w-full">

          <Tabs defaultValue="recommended">
            <div className=" flex justify-between items-center w-full">
              <div>
                <TabsList>
                  <TabsTrigger
                    value="recommended"
                    className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
                  >
                    Recommended
                  </TabsTrigger>
                  <TabsTrigger
                    value="popular"
                    className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
                  >
                    Popular
                  </TabsTrigger>
                  <TabsTrigger
                    value="nearest"
                    className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
                  >
                    Nearest
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-base font-semibold">Map View</span>
                <Switch
                  checked={isMapView}
                  onChange={(checked) => setIsMapView(checked)}
                  size="default"
                  style={{
                    backgroundColor: isMapView ? '#006845' : '#adadad'
                  }}
                />
              </div>
            </div>

            {isMapView ? (
              <div className=" mt-5 mb-5 w-full">
                <Map />
              </div>
            ) : (
              <>
                <TabsContent value="recommended">
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold mb-4">Recommended Listings</h2>
                    {/* Add your recommended listings content here */}
                  </div>
                </TabsContent>

                <TabsContent value="popular">
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold mb-4">Popular Listings</h2>
                    {/* Add your popular listings content here */}
                  </div>
                </TabsContent>

                <TabsContent value="nearest">
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold mb-4">Nearest Listings</h2>
                    {/* Add your nearest listings content here */}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>

          <div className=" mb-5">
            <h1 className=" mb-3 font-semibold text-lg text-gray-600">Most Popular Boarding House</h1>

            <PopularCard />
          </div>

          <div className=" mt-10 items-center justify-center w-full">
            <h1 className=" text-gray-600 font-semibold text-center">UniNest © {new Date().getFullYear()}</h1>
          </div>

        </div>
      </div>
    </>
  );
}
