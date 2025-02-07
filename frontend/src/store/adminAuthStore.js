import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAdminAuthStore = create((set) => ({
    admin: null,
    isAdminAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAdminAuth: true,
    message: null,

    adminSignup: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/admin/register`, { email, password, username });
            set({ admin: response.data.admin, isAdminAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    adminLogin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/admin/login`, { email, password });
            set({
                isAdminAuthenticated: true,
                admin: response.data.admin,
                error: null,
                isLoading: false,
            });

            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    adminLogout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/admin/logout`);
            set({ admin: null, isAdminAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    checkAdminAuth: async () => {
        set({ isCheckingAdminAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/admin/checkAdminAuth`);
            set({ admin: response.data.admin, isAdminAuthenticated: true, isCheckingAdminAuth: false });
        } catch (error) {
            set({ error: null, isCheckingAdminAuth: false, isAdminAuthenticated: false });
        }
    }
}));