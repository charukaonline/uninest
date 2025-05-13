import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/admin"
    : "/api/admin";

export const useAdminStore = create((set, get) => ({
  unverifiedLandlords: [],
  allUsers: [],
  userStats: {
    total: 0,
    students: 0,
    landlords: 0,
    admins: 0,
    flagged: 0,
    verified: 0,
    monthlyGrowth: {},
    studentPreferences: { propertyTypes: {}, areas: {} },
    subscriptions: { premium: 0, premiumRate: 0 },
    landlordVerification: { pending: 0, verified: 0, rejected: 0 },
    activity: {
      activeLast24h: 0,
      activeLast7d: 0,
      activeLast30d: 0,
      activeRate24h: 0,
      activeRate7d: 0,
      activeRate30d: 0,
    },
  },
  listingStats: {
    total: 0,
    byPropertyType: {},
    averageRent: 0,
    highestViewed: null,
    mostBookmarked: null,
    averageElo: 0,
    cityDistribution: {},
    priceRanges: {},
    recentListings: 0,
    newListingsRate: 0,
  },
  reportStats: {
    total: 0,
    pending: 0,
    investigating: 0,
    resolved: 0,
    dismissed: 0,
    byType: {},
    recentReports: 0,
    weeklyTrend: 0,
    topReportedListings: [],
    averageResolutionTime: 0,
  },
  reviewStats: {
    total: 0,
    spam: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0,
    sentiments: { positive: 0, neutral: 0, negative: 0 },
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    recentReviews: 0,
    monthlyRate: 0,
    topReviewedListings: [],
  },
  scheduleStats: {
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    popularDays: {},
    popularTimes: {},
    recentSchedules: 0,
    weeklyRate: 0,
    conversionRate: 0,
    topScheduledListings: [],
    topLandlords: [],
  },
  communicationStats: {
    messaging: {
      totalConversations: 0,
      totalMessages: 0,
      avgMessagesPerConversation: 0,
      recentMessages: 0,
      messageVolumeTrend: {},
    },
    notifications: {
      total: 0,
      byType: {},
      readRate: 0,
    },
  },
  isLoading: false,
  error: null,
  shouldRefresh: true,

  fetchUnverifiedLandlords: async (signal) => {
    const isInitialLoad = get().unverifiedLandlords.length === 0;
    if (isInitialLoad) {
      set({ isLoading: true, error: null });
    }

    try {
      const response = await axios.get(`${API_URL}/unverified-landlords`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        signal,
      });

      set({
        unverifiedLandlords: response.data.landlords,
        shouldRefresh: response.data.landlords.length > 0, // Update refresh state
        isLoading: false,
        error: null,
      });
    } catch (error) {
      if (error.name === "CanceledError") return;

      set({
        error: error.response?.data?.message || "Failed to fetch landlords",
        isLoading: false,
        unverifiedLandlords: [],
        shouldRefresh: false,
      });
    }
  },

  fetchAllUsers: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = response.data.users || [];

      // Calculate user statistics
      const students = users.filter((user) => user.role === "user").length;
      const landlords = users.filter((user) => user.role === "landlord").length;
      const flagged = users.filter((user) => user.isFlagged).length;
      const verified = users.filter((user) => user.isVerified).length;

      set({
        allUsers: users,
        userStats: {
          total: users.length,
          students,
          landlords,
          flagged,
          verified,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch dashboard statistics
  fetchDashboardStats: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem("adminToken");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || API_URL.replace("/api/admin", "");

      // Fetch user statistics
      const userStatsResponse = await axios.get(
        `${backendUrl}/api/admin/user-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch listing statistics
      const listingStatsResponse = await axios.get(
        `${backendUrl}/api/admin/listing-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch report statistics
      const reportStatsResponse = await axios.get(
        `${backendUrl}/api/admin/report-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch review statistics
      const reviewStatsResponse = await axios.get(
        `${backendUrl}/api/admin/review-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch schedule statistics
      const scheduleStatsResponse = await axios.get(
        `${backendUrl}/api/admin/schedule-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch communication statistics
      const communicationStatsResponse = await axios.get(
        `${backendUrl}/api/admin/communication-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        userStats: userStatsResponse.data || {
          total: 0,
          students: 0,
          landlords: 0,
          admins: 0,
          flagged: 0,
          verified: 0,
          monthlyGrowth: {},
          studentPreferences: { propertyTypes: {}, areas: {} },
          subscriptions: { premium: 0, premiumRate: 0 },
          landlordVerification: { pending: 0, verified: 0, rejected: 0 },
          activity: {
            activeLast24h: 0,
            activeLast7d: 0,
            activeLast30d: 0,
            activeRate24h: 0,
            activeRate7d: 0,
            activeRate30d: 0,
          },
        },
        listingStats: listingStatsResponse.data || {
          total: 0,
          byPropertyType: {},
          averageRent: 0,
          highestViewed: null,
          mostBookmarked: null,
          averageElo: 0,
          cityDistribution: {},
          priceRanges: {},
          recentListings: 0,
          newListingsRate: 0,
        },
        reportStats: reportStatsResponse.data || {
          total: 0,
          pending: 0,
          investigating: 0,
          resolved: 0,
          dismissed: 0,
          byType: {},
          recentReports: 0,
          weeklyTrend: 0,
          topReportedListings: [],
          averageResolutionTime: 0,
        },
        reviewStats: reviewStatsResponse.data || {
          total: 0,
          spam: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          averageRating: 0,
          sentiments: { positive: 0, neutral: 0, negative: 0 },
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          recentReviews: 0,
          monthlyRate: 0,
          topReviewedListings: [],
        },
        scheduleStats: scheduleStatsResponse.data || {
          total: 0,
          pending: 0,
          confirmed: 0,
          rejected: 0,
          popularDays: {},
          popularTimes: {},
          recentSchedules: 0,
          weeklyRate: 0,
          conversionRate: 0,
          topScheduledListings: [],
          topLandlords: [],
        },
        communicationStats: communicationStatsResponse.data || {
          messaging: {
            totalConversations: 0,
            totalMessages: 0,
            avgMessagesPerConversation: 0,
            recentMessages: 0,
            messageVolumeTrend: {},
          },
          notifications: {
            total: 0,
            byType: {},
            readRate: 0,
          },
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Toggle user flag status
  toggleUserFlag: async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/toggle-user-flag/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user._id === userId ? { ...user, isFlagged: !user.isFlagged } : user
        ),
      }));
    } catch (error) {
      console.error("Error toggling user flag:", error);
      set({ error: error.message });
    }
  },

  // Add method to manually control refresh
  setShouldRefresh: (value) => set({ shouldRefresh: value }),
}));
