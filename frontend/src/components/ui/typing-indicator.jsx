import React from "react";

export const TypingIndicator = ({ username }) => {
  return (
    <div className="flex items-center space-x-2 text-gray-500 text-sm italic mt-1 animate-pulse">
      <span>{username} is typing</span>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animation-delay-200"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animation-delay-400"></div>
      </div>
    </div>
  );
};
