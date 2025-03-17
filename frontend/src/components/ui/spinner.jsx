import React from "react";

export const Spinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClass} border-4 border-t-primaryBgColor border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};
