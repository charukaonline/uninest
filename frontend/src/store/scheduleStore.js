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
};

export default scheduleStore;
