import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/auth' : "/api/auth";

axios.defaults.withCredentials = true;

export const useLandlordAuthStore = create((set) => ({
    landlord: null,
    isLandlordAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingLandlordAuth: true,
    message: null,

    landlordSignupStep1: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/landlord/signup/step1`, data);
            set({ message: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Signup failed', isLoading: false });
            throw error;
        }
    },

    landlordSignupStep2: async (landlordId, data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/landlord/signup/step2/${userId}`, data);
            set({ message: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Signup step 2 failed', isLoading: false });
            throw error;
        }
    },

    landlordSignin: async (credentials) => {
        try {
            set({ isLoading: true, error: null });
            const response = await axios.post(`${API_URL}/landlord/signin`, credentials);
            set({ landlord: response.data.landlord, isLandlordAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Signin failed', isLandlordAuthenticated: false, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true, error: null });
            await axios.post(`${API_URL}/landlord/logout`);
            set({ landlord: null, isLandlordAuthenticated: false, isLoading: false, message: 'Logged out successfully' });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Logout failed', isLoading: false });
            throw error;
        }
    },
}));