import StudentSidebar from "@/components/student_dashboard/StudentSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import MessageStatus from "@/components/chat/MessageStatus";
import ConversationItem from "@/components/chat/ConversationItem";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { Empty } from "antd";

const ChatInterface = () => {
  const {
    messages,
    activeConversation,
    sendNewMessage,
    loading,
    formatMessageTime,
  } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await sendNewMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex justify-center items-center h-full">
        <h1
          className="bg-white text-primaryBgColor rounded-lg p-2"
          style={{ userSelect: "none" }}
        >
          Select a chat to start messaging
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 rounded-lg flex items-center space-x-3 bg-[#181818]">
        <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white text-xl font-bold">
          {activeConversation.recipient.username
            ? activeConversation.recipient.username.charAt(0).toUpperCase()
            : "U"}
        </div>
        <div className="items-center space-y-0">
          <h2 className="font-semibold text-white">
            {activeConversation.recipient.username}
          </h2>
          <p className="text-gray-400">
            {activeConversation.property
              ? `Regarding: ${activeConversation.property.propertyName}`
              : "General conversation"}
          </p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <ScrollArea className="h-[calc(100vh-178px)]">
        <div
          className="flex-1 p-4 overflow-y-auto space-y-4"
          style={{
            backgroundImage: "url(/chat-background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === user._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.sender._id === user._id
                      ? "bg-[#181818] text-white"
                      : "bg-white text-[#181818]"
                  } p-3 rounded-lg shadow`}
                >
                  <p className="text-base">{message.text}</p>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs ${
                        message.sender._id === user._id
                          ? "text-gray-400"
                          : "text-gray-500"
                      } text-right mt-1`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </p>
                    {message.sender._id === user._id && (
                      <MessageStatus status={message.status} />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} /> {/* Scroll anchor */}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 bg-[#181818] rounded-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
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
  const {
    conversations,
    loading,
    selectConversation,
    activeConversation,
    unreadCount,
  } = useChat();

  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) Messages` : "Messages";
  }, [unreadCount]);

  return (
    <div className="flex h-screen bg-white">
      <div>
        <StudentSidebar />
      </div>

      <div className="flex-1 p-4" style={{ marginLeft: "210px" }}>
        <div className="flex justify-between w-full h-fulFl gap-4">
          {/* Chatting Section */}
          <div
            className="w-3/4 bg-white rounded-lg shadow-md"
            style={{
              backgroundImage: "url(/chat-background.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <ChatInterface />
          </div>

          {/* All Message Section */}
          <div className="w-1/4 bg-white rounded-lg shadow-md p-4 px-2 overflow-hidden">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xl text-primaryBgColor">
                All Messages
              </h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="mt-5">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Spinner />
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <ConversationItem
                      key={conversation._id}
                      conversation={conversation}
                      isActive={
                        activeConversation &&
                        activeConversation._id === conversation._id
                      }
                      onClick={selectConversation}
                    />
                  ))
                ) : (
                  <Empty
                    description="No conversations yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StdInbox;
