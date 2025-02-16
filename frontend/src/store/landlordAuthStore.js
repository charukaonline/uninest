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
            // Create a proper FormData object if it's not already one
            const formDataToSend = data instanceof FormData ? data : new FormData();

            // If data is not FormData, append each field
            if (!(data instanceof FormData)) {
                Object.keys(data).forEach(key => {
                    formDataToSend.append(key, key);
                });
            }

            const response = await axios.post(
                `${API_URL}/landlord/signup/step2/${landlordId}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            set({ message: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Signup step 2 failed';
            set({ error: errorMsg, isLoading: false });
            throw new Error(errorMsg);
        }
    },

    landlordSignin: async (credentials) => {
        try {
            set({ isLoading: true, error: null });

            const response = await axios.post(`${API_URL}/landlord/signin`, credentials);
            console.log('Signin response:', response.data); // Debug log

            if (!response.data.landlord) {
                throw new Error('Invalid response from server');
            }

            const landlordData = response.data.landlord;

            set({
                landlord: landlordData,
                isLandlordAuthenticated: landlordData.isVerified,
                isLoading: false
            });

            return response.data;
        } catch (error) {
            console.error('Signin error:', error); // Debug log
            set({
                error: error.response?.data?.message || 'Authentication failed',
                isLandlordAuthenticated: false,
                isLoading: false,
                landlord: null
            });
            throw error;
        }
    },

    landlordLogout: async () => {
        try {
            set({ isLoading: true, error: null });
            await axios.post(`${API_URL}/landlord/logout`);
            set({ landlord: null, isLandlordAuthenticated: false, isLoading: false, message: 'Logged out successfully' });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Logout failed', isLoading: false });
            throw error;
        }
    },

    checkLandlordAuth: async () => {
        set({ isCheckingLandlordAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/landlord/checkLandlordAuth`);
            set({ landlord: response.data.landlord, isLandlordAuthenticated: true, isCheckingLandlordAuth: false });
        } catch (error) {
            set({ error: null, isCheckingLandlordAuth: false, isLandlordAuthenticated: false });
        }
    },
}));