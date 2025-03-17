import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:5000/api";
let socket = null;

// Initialize socket connection
export const initializeSocket = (token) => {
  if (socket) return socket;

  socket = io("http://localhost:5000", {
    auth: { token },
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get all conversations for current user
export const getConversations = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

// Get messages for a specific conversation
export const getMessages = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/chat/conversations/${conversationId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (conversationId, text) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/chat/messages`,
      { conversationId, text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Create a new conversation
export const createConversation = async (
  recipientId,
  propertyId,
  initialMessage
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/chat/conversations`,
      { recipientId, propertyId, initialMessage },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

// Mark messages as read
export const markAsRead = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/chat/conversations/${conversationId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};
