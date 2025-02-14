import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/admin" : "/api/admin";

export const useAdminStore = create((set, get) => ({
    unverifiedLandlords: [],
    isLoading: false,
    error: null,

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

            const currentData = JSON.stringify(get().unverifiedLandlords);
            const newData = JSON.stringify(response.data.landlords);

            if (currentData !== newData) {
                set({ unverifiedLandlords: response.data.landlords });
            }

            if (isInitialLoad) {
                set({ isLoading: false });
            }
        } catch (error) {
            if (error.name === 'CanceledError') return;

            set({
                error: error.response?.data?.message || "Failed to fetch landlords",
                isLoading: false,
            });
        }
    },
}));