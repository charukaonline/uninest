import axios from "axios";
import { create } from 'zustand';

const API_URL = import.meta.env.MODE === "development" 
    ? "http://localhost:5000/api/notifications"
    : "/api/notifications";

const useNotificationStore = create((set) => ({
    notifications: [],
    loading: false,
    error: null,
    
    // Fetch all notifications for a user
    fetchUserNotifications: async (userId) => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_URL}/user/${userId}`);
            set({ 
                notifications: response.data.notifications, 
                loading: false,
                error: null 
            });
            return response.data.notifications;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            set({ 
                error: error.response?.data?.message || "Failed to load notifications", 
                loading: false 
            });
            throw error;
        }
    },
    
    // Mark a notification as read
    markAsRead: async (notificationId) => {
        try {
            await axios.patch(`${API_URL}/${notificationId}/read`);
            set(state => ({
                notifications: state.notifications.map(notification =>
                    notification._id === notificationId 
                        ? { ...notification, read: true } 
                        : notification
                )
            }));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    }
}));

export default useNotificationStore;
