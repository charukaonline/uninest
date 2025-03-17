import React from "react";
import { Bs1CircleFill } from "react-icons/bs";
import { CheckCheck } from "lucide-react";

const ConversationItem = ({ conversation, isActive, onClick }) => {
  // Helper function to truncate text
  const truncateText = (text, maxLength = 16) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();

    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    // Otherwise show date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`flex items-center space-x-3 mb-4 hover:bg-gray-100 rounded-md w-full p-1 py-2 px-2 cursor-pointer ${
        isActive ? "bg-gray-100" : ""
      }`}
      onClick={() => onClick(conversation)}
    >
      <div className="w-12 h-12 rounded-full bg-purple-400 flex-shrink-0 flex items-center justify-center text-white text-xl font-bold">
        {conversation.recipient.username
          ? conversation.recipient.username.charAt(0).toUpperCase()
          : "U"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold truncate text-primaryBgColor">
            {conversation.recipient.username}
          </h1>
          <span className="text-xs text-gray-500">
            {conversation.lastMessage &&
              formatTimestamp(conversation.lastMessage.createdAt)}
          </span>
        </div>
        <div className="flex items-center space-y-0 space-x-1">
          {conversation.unreadCount > 0 ? (
            <Bs1CircleFill className="size-4 text-primaryBgColor fill-primaryBgColor" />
          ) : conversation.lastMessage &&
            conversation.lastMessage.status === "read" ? (
            <CheckCheck className="size-4 text-blue-500" />
          ) : null}
          <p className="text-gray-600 truncate">
            {conversation.lastMessage
              ? truncateText(conversation.lastMessage.text, 20)
              : "Start a conversation..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
