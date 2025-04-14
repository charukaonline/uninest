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

export function ChatDialog({ isOpen, setIsOpen, listing }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api";

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

  const checkExistingConversation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Find conversation with this landlord about this property
      const existingConversation = response.data.find(
        (conv) => conv.property?._id === listing._id
      );

      if (existingConversation) {
        setConversation(existingConversation);
        fetchMessages(existingConversation._id);
      }
    } catch (error) {
      console.error("Error checking existing conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `${API_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(response.data);

      // Mark messages as read
      await axios.put(
        `${API_URL}/chat/conversations/${conversationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

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

      // Create new conversation or send to existing one
      if (conversation) {
        // Send message to existing conversation
        const response = await axios.post(
          `${API_URL}/chat/messages`,
          {
            conversationId: conversation._id,
            text: message,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setMessages((prev) => [...prev, response.data]);
      } else {
        // Create new conversation with initial message
        const response = await axios.post(
          `${API_URL}/chat/conversations`,
          {
            recipientId: listing.landlord._id,
            propertyId: listing._id,
            initialMessage: message,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setConversation(response.data);
        // Refresh messages to see the initial message
        await fetchMessages(response.data._id);
      }

      setMessage(""); // Clear input field
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

        <div className="max-h-80 overflow-y-auto p-4 bg-gray-50 rounded-md">
          {messages.length > 0 ? (
            <div className="flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender._id === user?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender._id === user?._id
                        ? "bg-primaryBgColor text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
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
