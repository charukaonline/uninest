import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/messages` : "/api/messages";

const useMessageStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  // Fetch all conversations for the logged-in user
  fetchConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Use credentials: 'include' to send cookies automatically
      const response = await axios.get(`${API_URL}/conversations`, {
        withCredentials: true
      });
      
      set({ 
        conversations: response.data.data,
        isLoading: false 
      });
      
      return response.data.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch conversations',
        isLoading: false 
      });
      throw error;
    }
  },

  // Fetch messages for a specific conversation
  fetchMessages: async (conversationId) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.get(`${API_URL}/conversations/${conversationId}`, {
        withCredentials: true
      });
      
      set({ 
        messages: response.data.data,
        currentConversation: conversationId,
        isLoading: false 
      });
      
      return response.data.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch messages',
        isLoading: false 
      });
      throw error;
    }
  },

  // Send a new message
  sendMessage: async (recipientId, content, listingId = null) => {
    try {
      set({ isLoading: true, error: null });
      
      const payload = {
        recipientId,
        content,
        ...(listingId && { listingId })
      };
      
      const response = await axios.post(`${API_URL}/send`, payload, {
        withCredentials: true
      });
      
      // Update messages if we're in a conversation
      const { currentConversation, messages } = get();
      if (currentConversation) {
        set({ 
          messages: [...messages, response.data.data],
          isLoading: false 
        });
      }
      
      return response.data.data;
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error);
      set({ 
        error: error.response?.data?.message || 'Failed to send message',
        isLoading: false 
      });
      throw error;
    }
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    try {
      await axios.patch(`${API_URL}/read/${messageId}`, {}, {
        withCredentials: true
      });
      
      // Update message status in local state
      const { messages } = get();
      const updatedMessages = messages.map(msg => 
        msg._id === messageId 
          ? { ...msg, status: 'read', readAt: new Date().toISOString() } 
          : msg
      );
      
      set({ messages: updatedMessages });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  },

  // Get unread message count
  getUnreadCount: () => {
    const { conversations } = get();
    if (!conversations || conversations.length === 0) return 0;
    
    // Check if we're using it from a landlord or student context
    const userId = localStorage.getItem('landlordId') || localStorage.getItem('userId');
    if (!userId) return 0;
    
    return conversations.reduce((total, conv) => {
      const unreadForUser = conv.unreadCount?.[userId] || 0;
      return total + unreadForUser;
    }, 0);
  },

  // Clear current messages (when switching conversations)
  clearMessages: () => {
    set({ messages: [], currentConversation: null });
  },
  
  // Add a message to the current conversation
  addMessageToState: (message) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
  },
  
  // Update a message's status
  updateMessageStatus: (messageId, status) => {
    const { messages } = get();
    const updatedMessages = messages.map(msg => 
      msg._id === messageId ? { ...msg, status } : msg
    );
    set({ messages: updatedMessages });
  }
}));

export default useMessageStore;