import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  markAsRead,
  initializeSocket,
  disconnectSocket,
} from "../services/chatService";
import { useAuthStore } from "../store/authStore";
import { notification } from "antd";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem("token");
      const socketInstance = initializeSocket(token);
      setSocket(socketInstance);

      // Set up socket event listeners
      socketInstance.on("new_message", handleNewMessage);
      socketInstance.on("new_conversation", handleNewConversation);
      socketInstance.on("messages_read", handleMessagesRead);

      // Load conversations
      fetchConversations();

      return () => {
        socketInstance.off("new_message", handleNewMessage);
        socketInstance.off("new_conversation", handleNewConversation);
        socketInstance.off("messages_read", handleMessagesRead);
        disconnectSocket();
      };
    }
  }, [isAuthenticated, user]);

  // Calculate total unread messages
  useEffect(() => {
    const totalUnread = conversations.reduce(
      (total, conv) => total + conv.unreadCount,
      0
    );
    setUnreadCount(totalUnread);
  }, [conversations]);

  // Socket event handlers
  const handleNewMessage = ({ message, conversationId }) => {
    // Update messages if the message belongs to active conversation
    if (activeConversation && activeConversation._id === conversationId) {
      setMessages((prev) => [...prev, message]);
      // Mark as read since we're viewing this conversation
      markAsRead(conversationId);
    }

    // Update conversation list
    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCount:
              activeConversation && activeConversation._id === conversationId
                ? 0
                : conv.unreadCount + 1,
          };
        }
        return conv;
      });
    });

    // If not in active conversation, show notification
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
        msg.conversationId === conversationId && msg.sender._id === user._id
          ? { ...msg, status: "read" }
          : msg
      )
    );
  };

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
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
    try {
      setLoading(true);
      const data = await getMessages(conversationId);
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
    setActiveConversation(conversation);
    if (conversation) {
      await fetchMessages(conversation._id);
      await markAsRead(conversation._id);

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
    if (!activeConversation) return;

    try {
      const sentMessage = await sendMessage(activeConversation._id, text);
      setMessages((prev) => [...prev, sentMessage]);

      // Update conversation list with the new message
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === activeConversation._id
            ? { ...conv, lastMessage: sentMessage }
            : conv
        )
      );

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
    try {
      setLoading(true);
      const newConversation = await createConversation(
        recipientId,
        propertyId,
        initialMessage
      );
      setConversations((prev) => [newConversation, ...prev]);
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

  // Format timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const value = {
    conversations,
    messages,
    loading,
    activeConversation,
    unreadCount,
    selectConversation,
    sendNewMessage,
    startNewConversation,
    fetchConversations,
    formatMessageTime,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
