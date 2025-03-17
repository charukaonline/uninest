import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:5000/api";
let socket = null;

// Initialize socket connection with proper user type detection
export const initializeSocket = (userType = "user") => {
  if (socket) return socket;

  const token = localStorage.getItem(
    userType === "landlord" ? "landlordToken" : "token"
  );

  if (!token) {
    console.error("No token found for socket connection");
    return null;
  }

  socket = io("http://localhost:5000", {
    auth: { token, userType },
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected for", userType);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  // Add handler for message receipt to mark messages as delivered
  socket.on("new_message", ({ message }) => {
    // Acknowledge receipt by emitting delivery status
    socket.emit("message_delivered", { messageId: message._id });
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
export const getConversations = async (userType = "user") => {
  try {
    const token = localStorage.getItem(
      userType === "landlord" ? "landlordToken" : "token"
    );
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
export const getMessages = async (conversationId, userType = "user") => {
  try {
    const token = localStorage.getItem(
      userType === "landlord" ? "landlordToken" : "token"
    );
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
export const sendMessage = async (conversationId, text, userType = "user") => {
  try {
    const token = localStorage.getItem(
      userType === "landlord" ? "landlordToken" : "token"
    );
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
export const startNewConversation = async (
  landlordId,
  propertyId,
  initialMessage,
  userType = "user"
) => {
  try {
    const token = localStorage.getItem(
      userType === "landlord" ? "landlordToken" : "token"
    );
    const response = await axios.post(
      `${API_URL}/chat/conversations`,
      { recipientId: landlordId, propertyId, initialMessage },
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
export const markAsRead = async (conversationId, userType = "user") => {
  try {
    const token = localStorage.getItem(
      userType === "landlord" ? "landlordToken" : "token"
    );
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
