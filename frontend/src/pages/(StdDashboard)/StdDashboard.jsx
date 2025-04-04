import LoadingSpinner from "@/components/include/LoadingSpinner";
import StudentSidebar from "@/components/student_dashboard/StudentSidebar";
import { useAuthStore } from "@/store/authStore";
import { useRecommendationStore } from "@/store/recommendationStore";
import { useBookmarkStore } from "@/store/bookmarkStore"; // Import bookmark store
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Tooltip, notification } from "antd";
import Map from "@/components/include/Map";
import { motion } from "framer-motion";
import UserPreference from '@/components/signup_pages/UserPreference';
import { useEffect, useState } from "react";
import PopularCard from "@/components/student_dashboard/PopularCard";
import RecommendationCard from "@/components/student_dashboard/RecommendationCard";
import { Link } from "react-router-dom";
import { FaBuilding, FaHome, FaBookmark } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function StudentDashboard() {
  const [isMapView, setIsMapView] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isViewingBookmarks, setIsViewingBookmarks] = useState(false); // New state for bookmarks

  const { user, isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();
  const { recommendations, isLoading: recommendationsLoading, fetchRecommendations, error: recommendationError } = useRecommendationStore();
  const { bookmarks, isLoading: bookmarksLoading, fetchBookmarks, error: bookmarkError } = useBookmarkStore(); // Bookmark store

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    } else if (user && isAuthenticated && user._id) {
      fetchRecommendations(user._id); // Fetch recommendations
      fetchBookmarks(user._id); // Fetch bookmarks

      if (!user.hasCompletedPreferences) {
        const timer = setTimeout(() => {
          setShowPreferences(true);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (recommendationError) {
      notification.error({
        message: "Error loading recommendations",
        description: recommendationError
      });
    }
  }, [recommendationError]);

  useEffect(() => {
    if (bookmarkError) {
      notification.error({
        message: "Error loading bookmarks",
        description: bookmarkError
      });
    }
  }, [bookmarkError]);

  // Enhanced function to refresh bookmarks
  const refreshBookmarks = async () => {
    if (isAuthenticated && user?._id) {
      try {
        await fetchBookmarks(user._id);
      } catch (error) {
        console.error("Error refreshing bookmarks:", error);
      }
    }
  };

  // Add this effect to refresh bookmarks when the view changes
  useEffect(() => {
    if (isViewingBookmarks) {
      refreshBookmarks();
    }
  }, [isViewingBookmarks]);

  const handlePreferenceClose = (values) => {
    // Mark preferences as completed
    localStorage.setItem("hasCompletedPreferences", "true");
    setShowPreferences(false);
  };

  const toggleView = () => {
    setIsViewingBookmarks((prev) => !prev); // Toggle between bookmarks and recommendations
  };

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

        <div style={{ marginLeft: '210px', padding: '1rem' }} className="w-full">
          <Tabs defaultValue="recommended">
            <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="font-semibold text-xl">
                  {isViewingBookmarks ? "Your Bookmarks" : "Recommended for you"}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <Link
                    to="/"
                    className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <FaHome />Home
                  </Link>
                  <Link
                    to="/all-listings"
                    className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <FaBuilding />All Listings
                  </Link>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleView}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      isViewingBookmarks 
                        ? "bg-gray-300 text-gray-800" 
                        : "bg-primaryBgColor text-white"
                    }`}
                  >
                    <FaBookmark className={isViewingBookmarks ? "text-gray-800" : "text-white"} />
                    {isViewingBookmarks ? "View Recommendations" : "View Bookmarks"}
                  </button>
                </div>
              </div>
            </div>

            {isMapView ? (
              <div className="mt-5 mb-5 w-full">
                <Map />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 mb-8">
                  {isViewingBookmarks ? (
                    bookmarksLoading ? (
                      <div className="col-span-full flex justify-center py-8">
                        <Loader2 className="animate-spin" />
                      </div>
                    ) : bookmarks && bookmarks.length > 0 ? (
                      bookmarks.map((bookmark) => (
                        <RecommendationCard 
                          key={bookmark._id} 
                          listing={bookmark}
                          isBookmarked={true}
                          showMatchScore={false}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 flex flex-col items-center">
                        <p className="text-gray-500 mb-4">No bookmarks available at the moment.</p>
                        <button
                          onClick={() => setIsViewingBookmarks(false)}
                          className="bg-primaryBgColor text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Explore Recommendations
                        </button>
                      </div>
                    )
                  ) : recommendationsLoading ? (
                    <div className="col-span-full flex justify-center py-8">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : recommendations && recommendations.length > 0 ? (
                    recommendations.map((listing) => (
                      <RecommendationCard key={listing._id} listing={listing} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No recommendations available at the moment.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </Tabs>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-5">
              <h1 className="mb-3 font-semibold text-lg text-gray-600">Most Popular Boarding House</h1>
              <PopularCard limit={1} />
            </div>
          </motion.div>

          <div className="mt-10 items-center justify-center w-full">
            <h1 className="text-gray-600 font-semibold text-center">UniNest © {new Date().getFullYear()}</h1>
          </div>
        </div>
      </div>

      {/* User Preferences Modal */}
      <UserPreference
        isVisible={showPreferences}
        onClose={handlePreferenceClose}
        userId={user?._id}
        token={localStorage.getItem("token")}
      />
    </>
  );
}
