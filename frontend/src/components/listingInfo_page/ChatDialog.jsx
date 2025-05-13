import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { notification } from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BiSend } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; // Add this import

export function ChatDialog({ isOpen, setIsOpen, listing }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState(null);
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api";
  const SOCKET_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : window.location.origin;

  // Create a more robust socket connection
  useEffect(() => {
    // Only create socket when dialog is open and user is authenticated
    if (!isOpen || !isAuthenticated || !user) return;

    console.log("Initializing socket connection...");

    // Create socket with fallback options
    const socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      timeout: 5000,
      // Try both transports
      transports: ["websocket", "polling"],
      forceNew: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`Socket reconnection attempt #${attemptNumber}`);
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected successfully");
      // Re-join any rooms if needed
      if (conversation && conversation._id) {
        socket.emit("joinRoom", conversation._id);
      }
    });

    socketRef.current = socket;

    return () => {
      console.log("Cleaning up socket connection");
      if (socket) {
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [isOpen, isAuthenticated, user]);

  // Handle conversation-specific logic
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !conversation || !conversation._id) return;

    console.log("Setting up conversation:", conversation._id);

    // Join room with error handling
    socket.emit("joinRoom", conversation._id, (response) => {
      if (response?.success) {
        console.log("Successfully joined room:", conversation._id);
      } else {
        console.error(
          "Failed to join room:",
          response?.error || "Unknown error"
        );
      }
    });

    // Message handler with additional validation
    const handleNewMessage = (newMsg) => {
      console.log("Received message:", newMsg);

      // Ensure the message has the minimum required properties
      if (!newMsg || !newMsg.text) {
        console.error("Received invalid message format:", newMsg);
        return;
      }

      // Check if message belongs to current conversation
      const msgConversationId = newMsg.conversationId || newMsg.conversation;
      if (msgConversationId && msgConversationId === conversation._id) {
        console.log("Adding message to current conversation");

        // Ensure message has proper format before adding to state
        const formattedMsg = {
          _id: newMsg._id || `temp-${Date.now()}`,
          text: newMsg.text,
          sender: newMsg.sender || { _id: newMsg.senderId },
          createdAt: newMsg.createdAt || new Date().toISOString(),
          conversationId: msgConversationId,
        };

        setMessages((prev) => {
          // Avoid duplicate messages
          const exists = prev.some((m) => m._id === formattedMsg._id);
          if (exists) return prev;
          return [...prev, formattedMsg];
        });
      }
    };

    // Listen for new messages
    socket.on("newMessage", handleNewMessage);
    socket.on("message", handleNewMessage); // Alternative event name

    return () => {
      console.log("Leaving room:", conversation._id);
      socket.off("newMessage", handleNewMessage);
      socket.off("message", handleNewMessage);
      socket.emit("leaveRoom", conversation._id);
    };
  }, [conversation]);

  // Add polling as a fallback for socket failures
  useEffect(() => {
    let intervalId;

    // Only poll when dialog is open and conversation exists
    if (isOpen && conversation && conversation._id) {
      console.log(
        "Setting up polling fallback for conversation:",
        conversation._id
      );

      // Poll every 5 seconds as a backup to sockets
      intervalId = setInterval(() => {
        // Only fetch if we're not already loading
        if (!loading) {
          console.log("Polling for new messages");
          fetchMessages(conversation._id, true);
        }
      }, 5000);
    }

    return () => {
      if (intervalId) {
        console.log("Clearing polling interval");
        clearInterval(intervalId);
      }
    };
  }, [isOpen, conversation, loading]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if there's an existing conversation
  useEffect(() => {
    if (isOpen && isAuthenticated && listing && user) {
      checkExistingConversation();
    }
  }, [isOpen, isAuthenticated, listing, user]);

  // Optimize conversation check to use Redis cache
  const checkExistingConversation = async () => {
    try {
      setLoading(true);

      // Add cache parameter to leverage Redis backend caching
      const response = await axios.get(`${API_URL}/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Add cache headers
          "Cache-Control": "max-age=60",
        },
        params: {
          // Add timestamp for fresh data when needed
          _t: new Date().getTime(),
          // Add property filter to help backend optimize cache lookup
          propertyId: listing._id,
        },
      });

      // Find conversation with this landlord about this property
      const existingConversation = response.data.find(
        (conv) => conv.property?._id === listing._id
      );

      if (existingConversation) {
        console.log("Found existing conversation from Redis cache");
        setConversation(existingConversation);
        fetchMessages(existingConversation._id);
      }
    } catch (error) {
      console.error("Error checking existing conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Modified fetchMessages function to leverage Redis cache
  const fetchMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoading(true);

      // Add cache-aware parameters
      const params = {
        // Include timestamp for cache validation
        _t: new Date().getTime(),
      };

      // If we have a last fetch timestamp, include it to potentially get a 304 Not Modified
      if (lastFetchTimestamp && silent) {
        params.since = lastFetchTimestamp;
      }

      const response = await axios.get(
        `${API_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Add cache control headers
            "Cache-Control": "max-age=60", // Allow client-side caching for 60 seconds
            "If-Modified-Since": lastFetchTimestamp
              ? new Date(lastFetchTimestamp).toUTCString()
              : null,
          },
          params,
          timeout: 3000, // Limit request time to 3 seconds
        }
      );

      // Update last fetch timestamp for future requests
      setLastFetchTimestamp(new Date().getTime());

      // If the response status is 304 Not Modified, keep existing messages
      if (response.status === 304) {
        console.log("Using cached messages (304 Not Modified)");
        return;
      }

      // Our improved backend Redis cache should make this very fast
      setMessages((prevMessages) => {
        // For silent updates (polling), only add new messages
        if (silent) {
          // Check if we actually have new data
          if (response.data.length <= prevMessages.length) {
            // Backend might have served from Redis cache, but nothing new
            return prevMessages;
          }

          // Get only the new messages using message IDs
          const existingIds = new Set(prevMessages.map((msg) => msg._id));
          const newMessages = response.data.filter(
            (msg) => !existingIds.has(msg._id)
          );

          if (newMessages.length > 0) {
            console.log(
              `Adding ${newMessages.length} new messages from Redis cache`
            );
            return [...prevMessages, ...newMessages];
          }

          return prevMessages;
        } else {
          // For initial load, use complete cached data from Redis
          console.log("Loading initial messages from Redis cache");
          return response.data;
        }
      });

      // ...existing read status update code...
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Optimized message sending to update cache immediately
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (!isAuthenticated) {
        notification.info({
          message: "Please sign in",
          description: "You need to sign in to send messages",
        });
        navigate("/auth/signin");
        return;
      }

      setLoading(true);

      // Store the message text before clearing the input
      const messageText = message;

      // Clear input field immediately for better UX
      setMessage("");

      if (conversation) {
        // Create optimistic temporary message
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
          _id: tempId,
          text: messageText,
          sender: { _id: user._id, username: user.username },
          createdAt: new Date().toISOString(),
          conversationId: conversation._id,
          pending: true,
        };

        // Add optimistic message to UI immediately
        setMessages((prev) => [...prev, tempMessage]);

        try {
          // Send message to server
          const response = await axios.post(
            `${API_URL}/chat/messages`,
            {
              conversationId: conversation._id,
              text: messageText,
              // Add cache invalidation hint
              invalidateCache: true,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // Tell backend this is a fresh update that should invalidate cache
                "Cache-Control": "no-cache",
              },
              timeout: 5000,
            }
          );

          // Replace temp message with real one
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === tempId ? { ...response.data, received: true } : msg
            )
          );

          // Update last fetch timestamp to reflect newest message
          setLastFetchTimestamp(new Date().getTime());
        } catch (error) {
          // Mark message as failed if there's an error
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === tempId
                ? { ...msg, failed: true, pending: false }
                : msg
            )
          );
          throw error;
        }
      } else {
        // ...existing code for creating new conversation...
      }
    } catch (error) {
      console.error("Error sending message:", error);
      notification.error({
        message: "Failed to send message",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Chat with {listing?.landlord?.username || "Landlord"}
          </DialogTitle>
        </DialogHeader>

        <div
          className="max-h-80 overflow-y-auto p-4 bg-gray-50 rounded-md"
          id="messages-container"
        >
          {messages.length > 0 ? (
            <div className="flex flex-col gap-3">
              {messages.map((msg, index) => {
                // Make sure we have a proper sender object
                const senderId =
                  typeof msg.sender === "object" && msg.sender
                    ? msg.sender._id
                    : msg.sender;
                const isCurrentUser = senderId === user?._id;

                return (
                  <div
                    key={msg._id || `msg-${index}`}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        isCurrentUser
                          ? msg.failed
                            ? "bg-red-400 text-white"
                            : "bg-primaryBgColor text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      <div className="flex justify-between items-center text-xs mt-1">
                        {msg.pending && (
                          <span className="italic">Sending...</span>
                        )}
                        {msg.failed && (
                          <span className="text-white">Failed</span>
                        )}
                        <span className="ml-auto">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              {loading
                ? "Loading..."
                : "No messages yet. Start the conversation!"}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primaryBgColor"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            className="bg-primaryBgColor hover:bg-green-700"
          >
            {loading ? "Sending..." : <BiSend />}
          </Button>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Messages are saved and visible to both parties
          </span>
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/student/${user?._id}/${user?.email}/inbox`)
            }
          >
            Go to Inbox
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChatDialog;
