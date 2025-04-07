import Sidebar from "@/components/landlord_dashboard/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, CheckCheck } from "lucide-react";
import { Bs1CircleFill } from "react-icons/bs";
import React, { useEffect, useState, useRef } from "react";

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

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there!", time: "11:50", sender: "other" },
    { id: 2, text: "Hi! How are you?", time: "11:51", sender: "me" },
    {
      id: 3,
      text: "I'm good, thanks for asking!",
      time: "11:52",
      sender: "other",
    },
    {
      id: 4,
      text: "Can you help me with something?",
      time: "11:53",
      sender: "other",
    },
    { id: 5, text: "Sure, what do you need?", time: "11:54", sender: "me" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          sender: "me",
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 rounded-lg flex items-center space-x-3 bg-[#181818]">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-12 h-12 rounded-full bg-purple-400"
        />
        <div className="items-center space-y-0">
          <h2 className="font-semibold text-white">{user.name}</h2>
          <p className="text-gray-400">Active 2m ago</p>
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === "me"
                    ? "bg-[#181818] text-white"
                    : "bg-white text-[#181818]"
                } p-3 rounded-lg shadow`}
              >
                <p className="text-base">{message.text}</p>
                <div className=" flex items-center justify-between">
                  <p
                    className={`text-xs ${
                      message.sender === "me"
                        ? "text-gray-400"
                        : "text-gray-500"
                    } text-right mt-1`}
                  >
                    {message.time}
                  </p>
                  {message.sender === "me" && <MessageStatus status="read" />}
                </div>
              </div>
            </div>
          ))}
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

const LandlordInbox = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const truncateText = (text, maxLength = 16) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  useEffect(() => {
    document.title = "(5) Active Chats";
  });

  const handleChatSelect = (user) => {
    setSelectedChat(user);
  };

  return (
    <div className="flex h-screen bg-white">
      <div>
        <Sidebar />
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
            {selectedChat ? (
              <ChatInterface user={selectedChat} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <h1
                  className="bg-white text-primaryBgColor rounded-lg p-2"
                  style={{ userSelect: "none" }}
                >
                  Select a chat to start messaging
                </h1>
              </div>
            )}
          </div>

          {/* All Message Section */}
          <div className="w-1/4 bg-white rounded-lg shadow-md p-4 px-2 overflow-hidden">
            <h1 className="font-semibold text-xl text-primaryBgColor">
              All Messages
            </h1>

            <ScrollArea className="h-[calc(100vh-100px)]">
              <div className="mt-5">
                <div
                  className="flex items-center space-x-3 mb-4 hover:bg-gray-100 rounded-md w-full p-1 py-2 px-2 cursor-pointer"
                  onClick={() =>
                    handleChatSelect({
                      name: "John Doe",
                      avatar: "https://via.placeholder.com/150",
                    })
                  }
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="w-12 h-12 rounded-full bg-purple-400 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h1 className="font-semibold truncate text-primaryBgColor">
                      John Doe
                    </h1>
                    <div className="flex items-center space-y-0 space-x-1">
                      <MessageStatus status="read" />
                      <p className="text-gray-600">
                        {truncateText(
                          "Hello, how are you? ugygyugygygugygyugygyg"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center space-x-3 mb-4 hover:bg-gray-100 rounded-md w-full p-1 py-2 px-2 cursor-pointer"
                  onClick={() =>
                    handleChatSelect({
                      name: "Alice Smith",
                      avatar: "https://via.placeholder.com/150",
                    })
                  }
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="w-12 h-12 rounded-full bg-purple-400 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h1 className="font-semibold truncate text-primaryBgColor">
                      Alice Smith
                    </h1>
                    <div className="flex items-center space-y-0 space-x-1">
                      <MessageStatus status="unread" />
                      <p className="text-gray-600">
                        {truncateText("Hey, I have a question about...")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordInbox;
