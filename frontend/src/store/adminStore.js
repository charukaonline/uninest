import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/admin" : "/api/admin";

export const useAdminStore = create((set, get) => ({
    unverifiedLandlords: [],
    isLoading: false,
    error: null,
    shouldRefresh: true, // New state to control refresh

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
                error: null
            });

        } catch (error) {
            if (error.name === 'CanceledError') return;
            
            set({
                error: error.response?.data?.message || "Failed to fetch landlords",
                isLoading: false,
                unverifiedLandlords: [],
                shouldRefresh: false
            });
        }
    },

    // Add method to manually control refresh
    setShouldRefresh: (value) => set({ shouldRefresh: value }),
}));