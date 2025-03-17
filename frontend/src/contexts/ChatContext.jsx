import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  getConversations,
  getMessages,
  sendMessage,
  startNewConversation as createConversation,
  markAsRead,
  initializeSocket,
  disconnectSocket,
} from "../services/chatService";
import { useAuthStore } from "../store/authStore";
import { useLandlordAuthStore } from "../store/landlordAuthStore";
import { notification } from "antd";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const { landlord, isLandlordAuthenticated } = useLandlordAuthStore();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState({});
  const [currentUserType, setCurrentUserType] = useState(null);
  const [messageStatusMap, setMessageStatusMap] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Determine the current active user
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentUserType("user");
    } else if (isLandlordAuthenticated && landlord) {
      setCurrentUserType("landlord");
    } else {
      setCurrentUserType(null);
    }
  }, [isAuthenticated, user, isLandlordAuthenticated, landlord]);

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (!currentUserType) return;

    const socketInstance = initializeSocket(currentUserType);
    if (socketInstance) {
      setSocket(socketInstance);

      // Set up socket event listeners
      socketInstance.on("new_message", handleNewMessage);
      socketInstance.on("new_conversation", handleNewConversation);
      socketInstance.on("messages_read", handleMessagesRead);
      socketInstance.on("user_typing", handleUserTyping);
      socketInstance.on("user_stopped_typing", handleUserStoppedTyping);
      socketInstance.on("message_status_update", handleMessageStatusUpdate);

      // Load conversations
      fetchConversations();

      return () => {
        socketInstance.off("new_message", handleNewMessage);
        socketInstance.off("new_conversation", handleNewConversation);
        socketInstance.off("messages_read", handleMessagesRead);
        socketInstance.off("user_typing", handleUserTyping);
        socketInstance.off("user_stopped_typing", handleUserStoppedTyping);
        socketInstance.off("message_status_update", handleMessageStatusUpdate);

        // Clean up typing timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        disconnectSocket();
      };
    }
  }, [currentUserType]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // Calculate total unread count from conversations
  useEffect(() => {
    if (conversations.length > 0) {
      const total = conversations.reduce(
        (sum, conv) => sum + (conv.unreadCount || 0),
        0
      );
      setUnreadCount(total);
    } else {
      setUnreadCount(0);
    }
  }, [conversations]);

  // Handle message status updates
  const handleMessageStatusUpdate = ({ messageId, status }) => {
    setMessageStatusMap((prev) => ({
      ...prev,
      [messageId]: status,
    }));

    // Also update in messages array if present
    setMessages((prev) =>
      prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
    );
  };

  // Handle new message reception
  const handleNewMessage = ({ message, conversationId }) => {
    // Update messages if in the same conversation
    if (activeConversation && activeConversation._id === conversationId) {
      setMessages((prev) => [...prev, message]);
      // Immediately mark as read since user is viewing this conversation
      markAsRead(conversationId, currentUserType);
    }

    // Update conversation list
    updateConversationWithNewMessage(conversationId, message);

    // Show notification if not in the active conversation
    if (!activeConversation || activeConversation._id !== conversationId) {
      const conversation = conversations.find((c) => c._id === conversationId);
      if (conversation) {
        notification.info({
          message: `New message from ${conversation.recipient.username}`,
          description: message.text,
          onClick: () => selectConversation(conversation),
        });
      }
    }
  };

  const updateConversationWithNewMessage = (conversationId, message) => {
    setConversations((prevConversations) => {
      const conversationIndex = prevConversations.findIndex(
        (c) => c._id === conversationId
      );

      if (conversationIndex === -1) {
        // Conversation not found, may need to fetch all conversations
        fetchConversations();
        return prevConversations;
      }

      const updatedConversations = [...prevConversations];
      const conversation = { ...updatedConversations[conversationIndex] };

      // Update last message
      conversation.lastMessage = message;

      // Increment unread count if not the active conversation
      if (!activeConversation || activeConversation._id !== conversationId) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }

      // Replace the conversation in the array
      updatedConversations[conversationIndex] = conversation;

      // Move this conversation to the top (most recent)
      updatedConversations.splice(conversationIndex, 1);
      updatedConversations.unshift(conversation);

      return updatedConversations;
    });
  };

  const handleNewConversation = async ({ conversationId, sender }) => {
    await fetchConversations();
    notification.info({
      message: `New conversation`,
      description: `${sender.username} started a conversation with you`,
    });
  };

  const handleMessagesRead = ({ conversationId }) => {
    // Update status of our messages in this conversation to "read"
    setMessages((prev) =>
      prev.map((msg) =>
        msg.conversationId === conversationId &&
        msg.sender._id ===
          (currentUserType === "user" ? user._id : landlord._id)
          ? { ...msg, status: "read" }
          : msg
      )
    );
  };

  const handleUserTyping = ({ conversationId, userId, username }) => {
    if (activeConversation && activeConversation._id === conversationId) {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: { username, timestamp: Date.now() },
      }));
    }
  };

  const handleUserStoppedTyping = ({ conversationId, userId }) => {
    if (activeConversation && activeConversation._id === conversationId) {
      setTypingUsers((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  // Function to emit typing status
  const emitTypingStatus = (isTyping) => {
    if (socket && activeConversation) {
      if (isTyping) {
        socket.emit("typing", { conversationId: activeConversation._id });
      } else {
        socket.emit("stop_typing", { conversationId: activeConversation._id });
      }
    }
  };

  // Format message time for display
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Fetch all conversations
  const fetchConversations = async () => {
    if (!currentUserType) return;

    try {
      setLoading(true);
      const data = await getConversations(currentUserType);
      // Sort conversations by most recent first
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setConversations(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      notification.error({
        message: "Error",
        description: "Failed to load conversations",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    if (!currentUserType) return;

    try {
      setLoading(true);
      const data = await getMessages(conversationId, currentUserType);
      setMessages(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      notification.error({
        message: "Error",
        description: "Failed to load messages",
      });
    } finally {
      setLoading(false);
    }
  };

  // Select a conversation
  const selectConversation = async (conversation) => {
    if (!currentUserType) return;

    setActiveConversation(conversation);
    if (conversation) {
      await fetchMessages(conversation._id);
      await markAsRead(conversation._id, currentUserType);

      // Update unread count
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
        )
      );
    }
  };

  // Send a new message
  const sendNewMessage = async (text) => {
    if (!activeConversation || !currentUserType) return;

    try {
      // Stop typing indicator when sending message
      emitTypingStatus(false);

      const sentMessage = await sendMessage(
        activeConversation._id,
        text,
        currentUserType
      );
      setMessages((prev) => [...prev, sentMessage]);

      // Update conversation list with the new message
      setConversations((prev) => {
        const updatedConversations = prev.map((conv) =>
          conv._id === activeConversation._id
            ? {
                ...conv,
                lastMessage: sentMessage,
                updatedAt: new Date().toISOString(),
              }
            : conv
        );

        // Sort to bring the updated conversation to the top
        updatedConversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        return updatedConversations;
      });

      return sentMessage;
    } catch (error) {
      console.error("Failed to send message:", error);
      notification.error({
        message: "Error",
        description: "Failed to send message",
      });
    }
  };

  // Start a new conversation
  const startNewConversation = async (
    recipientId,
    propertyId,
    initialMessage
  ) => {
    if (!currentUserType) return;

    try {
      setLoading(true);
      const newConversation = await createConversation(
        recipientId,
        propertyId,
        initialMessage,
        currentUserType
      );

      // Add the new conversation and sort
      setConversations((prev) => {
        const updatedConversations = [newConversation, ...prev];
        updatedConversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        return updatedConversations;
      });

      await selectConversation(newConversation);
      return newConversation;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      notification.error({
        message: "Error",
        description: "Failed to start new conversation",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle typing events with debounce
  const handleTyping = (text) => {
    if (!socket || !activeConversation) return;

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // If empty text, send stop typing
    if (!text.trim()) {
      emitTypingStatus(false);
      return;
    }

    // Send typing status
    emitTypingStatus(true);

    // Set timeout to stop typing indicator after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      emitTypingStatus(false);
    }, 3000);

    setTypingTimeout(timeout);
  };

  const value = {
    conversations,
    messages,
    loading,
    activeConversation,
    unreadCount,
    typingUsers,
    currentUserType,
    selectConversation,
    sendNewMessage,
    startNewConversation,
    fetchConversations,
    formatMessageTime,
    handleTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
