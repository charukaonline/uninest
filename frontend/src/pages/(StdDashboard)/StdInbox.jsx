import StudentSidebar from "@/components/student_dashboard/StudentSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, CheckCheck } from "lucide-react";
import { Bs1CircleFill } from "react-icons/bs";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { notification, Spin, Empty } from "antd";
import { io } from "socket.io-client";
import { format } from "date-fns";

const MessageStatus = ({ status }) => {
  switch (status) {
    case "sent":
      return <Check className="size-4 text-gray-500" />;
    case "delivered":
      return <CheckCheck className="size-4 text-gray-500" />;
    case "read":
      return <CheckCheck className="size-4 text-blue-500" />;
    case "unread":
      return (
        <Bs1CircleFill className="size-4 text-primaryBgColor fill-primaryBgColor" />
      );
    default:
      return null;
  }
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return format(new Date(dateString), "HH:mm");
};

const ChatInterface = ({ conversation, socket }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/chat/conversations/${conversation._id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data);

        // Mark messages as read
        await axios.put(
          `${API_URL}/chat/conversations/${conversation._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        notification.error({
          message: "Error loading messages",
          description: "Could not load conversation messages",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation, API_URL]);

  // Listen for new messages
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleNewMessage = (data) => {
      if (data.conversationId === conversation._id) {
        setMessages((prev) => [...prev, data.message]);

        // Mark as read immediately if we're in the conversation
        axios
          .put(
            `${API_URL}/chat/conversations/${conversation._id}/read`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .catch((err) => console.error("Error marking as read:", err));
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, conversation, API_URL]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return;

    try {
      const response = await axios.post(
        `${API_URL}/chat/messages`,
        {
          conversationId: conversation._id,
          text: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      notification.error({
        message: "Failed to send",
        description: "Your message could not be sent",
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative z-10">
      {/* Chat Header */}
      <div className="p-4 rounded-lg flex items-center space-x-3 bg-[#181818]">
        <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white text-xl font-bold">
          {conversation.recipient?.username?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="items-center space-y-0">
          <h2 className="font-semibold text-white">
            {conversation.recipient?.username || "User"}
          </h2>
          {conversation.property && (
            <p className="text-gray-400">
              Re: {conversation.property.propertyName}
            </p>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <ScrollArea className="h-[calc(100vh-178px)]">
        <div
          className="flex-1 p-4 overflow-y-auto space-y-4"
          style={{
            minHeight: "calc(100vh - 230px)",
          }}
        >
          {messages.length === 0 ? (
            <div className="text-center py-10 bg-white bg-opacity-70 rounded-lg">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === user?._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender._id === user?._id
                      ? "bg-[#181818] text-white"
                      : "bg-white text-[#181818]"
                  } p-3 rounded-lg shadow`}
                >
                  <p className="text-base">{message.text}</p>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs ${
                        message.sender._id === user?._id
                          ? "text-gray-400"
                          : "text-gray-500"
                      } text-right mt-1`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                    {message.sender._id === user?._id && (
                      <MessageStatus status={message.status || "sent"} />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 bg-[#181818] rounded-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-primaryBgColor"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const StdInbox = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api";

  const truncateText = (text, maxLength = 16) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Setup socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socketUrl =
      import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";
    const newSocket = io(socketUrl, {
      auth: { token: localStorage.getItem("token") },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Fetch conversations
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/chat/conversations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setConversations(response.data);

        // Select the first conversation by default if available
        if (response.data.length > 0 && !selectedConversation) {
          setSelectedConversation(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        notification.error({
          message: "Error loading chats",
          description: "Could not load your conversations",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated, API_URL]);

  // Listen for new conversations and messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      // Update conversation list to show latest message
      setConversations((prev) => {
        const updated = [...prev];
        const index = updated.findIndex(
          (conv) => conv._id === data.conversationId
        );

        if (index !== -1) {
          // Update unread count for conversation
          if (selectedConversation?._id !== data.conversationId) {
            updated[index] = {
              ...updated[index],
              unreadCount: (updated[index].unreadCount || 0) + 1,
              lastMessage: data.message,
            };
          }
        }

        // Re-sort conversations by latest message
        return updated.sort((a, b) => {
          const dateA = a.lastMessage?.createdAt
            ? new Date(a.lastMessage.createdAt)
            : new Date(0);
          const dateB = b.lastMessage?.createdAt
            ? new Date(b.lastMessage.createdAt)
            : new Date(0);
          return dateB - dateA;
        });
      });
    };

    const handleNewConversation = (data) => {
      // Fetch all conversations again to include the new one
      axios
        .get(`${API_URL}/chat/conversations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setConversations(response.data);
        })
        .catch((error) => {
          console.error("Error updating conversations:", error);
        });
    };

    const handleMessagesRead = (data) => {
      // Update read status for messages in the selected conversation
      if (selectedConversation?._id === data.conversationId) {
        setConversations((prev) => {
          const updated = [...prev];
          const index = updated.findIndex(
            (conv) => conv._id === data.conversationId
          );
          if (index !== -1) {
            updated[index] = { ...updated[index], unreadCount: 0 };
          }
          return updated;
        });
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("new_conversation", handleNewConversation);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("new_conversation", handleNewConversation);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, selectedConversation, API_URL]);

  // Update document title to show unread count
  useEffect(() => {
    const unreadTotal = conversations.reduce(
      (total, conv) => total + (conv.unreadCount || 0),
      0
    );
    document.title = unreadTotal > 0 ? `(${unreadTotal}) Chats` : "Chats";
  }, [conversations]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);

    // Mark as read when selected
    if (conversation.unreadCount > 0) {
      axios
        .put(
          `${API_URL}/chat/conversations/${conversation._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          // Update local state to reflect read status
          setConversations((prev) => {
            const updated = [...prev];
            const index = updated.findIndex(
              (conv) => conv._id === conversation._id
            );
            if (index !== -1) {
              updated[index] = { ...updated[index], unreadCount: 0 };
            }
            return updated;
          });
        })
        .catch((err) => {
          console.error("Error marking conversation as read:", err);
        });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in to view your messages</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <div>
        <StudentSidebar />
      </div>

      <div className="flex-1 p-4" style={{ marginLeft: "210px" }}>
        {loading && conversations.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex justify-between w-full h-full gap-4">
            {/* Chatting Section */}
            <div
              className="w-3/4 bg-white rounded-lg shadow-md overflow-hidden"
              style={{
                position: "relative",
              }}
            >
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: "url(/chat-background.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed",
                }}
              />
              {selectedConversation ? (
                <ChatInterface
                  conversation={selectedConversation}
                  socket={socket}
                />
              ) : conversations.length > 0 ? (
                <div className="flex justify-center items-center h-full">
                  <h1
                    className="bg-white text-primaryBgColor rounded-lg p-2"
                    style={{ userSelect: "none" }}
                  >
                    Select a conversation to start messaging
                  </h1>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  <Empty description="No conversations yet" />
                  <p className="mt-4 text-gray-600">
                    Start a conversation from a property listing page
                  </p>
                </div>
              )}
            </div>

            {/* All Message Section */}
            <div className="w-1/4 bg-white rounded-lg shadow-md p-4 px-2 overflow-hidden">
              <h1 className="font-semibold text-xl text-primaryBgColor">
                All Messages
              </h1>

              <ScrollArea className="h-[calc(100vh-100px)]">
                {conversations.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <Empty description="No conversations yet" />
                  </div>
                ) : (
                  <div className="mt-5">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation._id}
                        className={`flex items-center space-x-3 mb-4 hover:bg-gray-100 rounded-md w-full p-1 py-2 px-2 cursor-pointer ${
                          selectedConversation?._id === conversation._id
                            ? "bg-gray-100"
                            : ""
                        }`}
                        onClick={() => handleConversationSelect(conversation)}
                      >
                        <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {conversation.recipient?.username
                            ?.charAt(0)
                            .toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <h1 className="font-semibold truncate text-primaryBgColor">
                            {conversation.recipient?.username || "User"}
                          </h1>
                          <div className="flex items-center space-y-0 space-x-1">
                            {conversation.unreadCount > 0 && (
                              <MessageStatus status="unread" />
                            )}
                            <p className="text-gray-600">
                              {truncateText(
                                conversation.lastMessage?.text ||
                                  "No messages yet"
                              )}
                            </p>
                          </div>
                          {conversation.property && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {conversation.property.propertyName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StdInbox;
