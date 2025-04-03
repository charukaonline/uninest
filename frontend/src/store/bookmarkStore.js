import { create } from "zustand";
import axios from "axios";

export const useBookmarkStore = create((set) => ({
  bookmarks: [],
  isLoading: false,
  error: null,

  fetchBookmarks: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/bookmarks/${userId}`); // Ensure this matches the backend route
      set({ bookmarks: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch bookmarks",
        isLoading: false,
      });
    }
  },
}));
