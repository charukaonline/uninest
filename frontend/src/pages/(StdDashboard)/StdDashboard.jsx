import LoadingSpinner from "@/components/include/LoadingSpinner";
import StudentSidebar from "@/components/student_dashboard/StudentSidebar";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Tooltip } from "antd";
import Map from "@/components/include/Map";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import PopularCard from "@/components/student_dashboard/PopularCard";
import RecommendationCard from "@/components/student_dashboard/RecommendationCard";
import { Link } from "react-router-dom";

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
                <h2 className=" font-semibold text-xl">Recommended for you</h2>
              </div>
              <div className="flex items-center space-x-4">

                <div className=" space-x-4">
                  <span className=" p-2 bg-primaryBgColor text-white rounded-lg">
                    <Link to="/">Home</Link>
                  </span>
                  <span className=" p-2 bg-primaryBgColor text-white rounded-lg">
                    <Link to="/all-listings">All Listings</Link>
                  </span>
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
            </div>

            {isMapView ? (
              <div className=" mt-5 mb-5 w-full">
                <Map />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mt-5 mb-8">
                  <RecommendationCard />
                </div>
              </>
            )}
          </Tabs>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className=" mb-5">
              <h1 className=" mb-3 font-semibold text-lg text-gray-600">Most Popular Boarding House</h1>

              <PopularCard />
            </div>
          </motion.div>

          <div className=" mt-10 items-center justify-center w-full">
            <h1 className=" text-gray-600 font-semibold text-center">UniNest © {new Date().getFullYear()}</h1>
          </div>

        </div>
      </div>
    </>
  );
}
