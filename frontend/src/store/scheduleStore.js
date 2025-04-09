import axios from "axios";
import { notification } from "antd";

const API_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000/api/schedule"
        : "/api/schedule";

const scheduleStore = {
    schedules: [],

    // Add a new schedule
    addSchedule: async (scheduleData) => {
        try {
            const response = await axios.post(`${API_URL}/addSchedule`, scheduleData);

            if (response.data) {
                console.log("Schedule added successfully:", response.data);
                scheduleStore.schedules.push(response.data.schedule);

                notification.success({
                    message: "Success",
                    description: "Visit scheduled successfully",
                });

                return response.data;
            }
        } catch (error) {
            console.error("Error adding schedule:", error);

            notification.error({
                message: "Error",
                description:
                    error.response?.data?.message || "Failed to schedule visit",
            });

            throw error;
        }
    },

    // Get schedules for a specific user
    getSchedulesByUserId: async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/${userId}`);
            
            if (response.data) {
                scheduleStore.schedules = response.data.schedules;
                return response.data.schedules;
            }
        } catch (error) {
            console.error("Error fetching schedules:", error);
            
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "Failed to fetch schedules",
            });
            
            throw error;
        }
    }
};

export default scheduleStore;
