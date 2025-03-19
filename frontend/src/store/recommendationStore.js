import { create } from "zustand";
import axios from "axios";

// Point directly to the Python recommendation service
const RECOMMENDATION_API = "http://localhost:8000";

export const useRecommendationStore = create((set) => ({
    recommendations: [],
    isLoading: false,
    error: null,

    // Fetch recommendations based on user ID
    fetchRecommendations: async (userId) => {
        // Validate userId to prevent ObjectId casting errors
        if (!userId || typeof userId !== 'string' || userId.length !== 24) {
            set({ 
                error: "Valid user ID is required", 
                isLoading: false,
                recommendations: [] 
            });
            return;
        }

        set({ isLoading: true, error: null });
        
        try {
            // Direct connection to Python FastAPI service
            const response = await axios.get(`${RECOMMENDATION_API}/recommendations/${userId}`);
            
            // The Python API should return an array directly
            if (Array.isArray(response.data)) {
                set({
                    recommendations: response.data,
                    isLoading: false
                });
                return response.data;
            } else {
                // If not an array, try to extract listings from response object
                const listings = response.data?.listings || [];
                set({
                    recommendations: listings,
                    isLoading: false
                });
                return listings;
            }
        } catch (error) {
            console.error("Recommendation fetch error:", error);
            set({
                error: "Failed to fetch recommendations. Make sure the recommendation service is running.",
                isLoading: false,
                recommendations: []
            });
        }
    },

    // Fetch debug data to check student profile
    fetchDebugInfo: async (userId) => {
        if (!userId) return null;
        
        try {
            const response = await axios.get(`${RECOMMENDATION_API}/debug/studentprofiles`);
            return response.data;
        } catch (error) {
            console.error("Debug fetch error:", error);
            return null;
        }
    },

    // Clear recommendations (useful when logging out)
    clearRecommendations: () => {
        set({ recommendations: [], error: null });
    }
}));
