import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/auth' : "/api/auth";

axios.defaults.withCredentials = true;

export const useLandlordAuthStore = create((set, get) => ({
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
            
            if (!response.data.success || !response.data.landlord) {
                throw new Error('Invalid response from server');
            }

            // Check if landlord account is flagged
            if (response.data.landlord.isFlagged) {
                set({ isLoading: false });
                return {
                    error: true,
                    isFlagged: true,
                    message: "Your account has been suspended. Please contact support."
                };
            }

            set({
                landlord: response.data.landlord,
                isLandlordAuthenticated: true,
                isCheckingLandlordAuth: false,
                isLoading: false
            });

            return response.data;
        } catch (error) {
            if (error.response?.status === 403) {
                set({ isLoading: false });
                return {
                    error: true,
                    isFlagged: true,
                    message: error.response.data.message
                };
            }
            set({ landlord: null, isLandlordAuthenticated: false, isLoading: false });
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
        try {
            set({ isCheckingLandlordAuth: true });
            const response = await axios.get(`${API_URL}/landlord/checkLandlordAuth`);
            
            if (!response.data.success) {
                set({ 
                    landlord: null,
                    isLandlordAuthenticated: false, 
                    isCheckingLandlordAuth: false 
                });
                return false;
            }

            const landlordData = response.data.landlord;
            
            set({
                landlord: landlordData,
                isLandlordAuthenticated: true,
                isCheckingLandlordAuth: false
            });
            return true;
        } catch (error) {
            set({ 
                landlord: null,
                isLandlordAuthenticated: false, 
                isCheckingLandlordAuth: false 
            });
            return false;
        }
    },
}));