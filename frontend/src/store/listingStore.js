import axios from 'axios';
import { create } from 'zustand';

const API_URL = 'http://localhost:5000/api/listings';

// Keep the original addListing export
export const addListing = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add-listing`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Separate store for fetching listings
const useListingStore = create((set) => ({
    listings: [],
    loading: false,
    error: null,

    fetchAllListings: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(API_URL, {
                withCredentials: true,
            });
            set({ listings: response.data, loading: false, error: null });
        } catch (error) {
            console.error('Error fetching listings:', error);
            set({ error: error.message, loading: false });
        }
    }
}));

export default useListingStore;