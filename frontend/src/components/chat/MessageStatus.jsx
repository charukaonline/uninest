import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { Bs1CircleFill } from "react-icons/bs";

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

export default MessageStatus;
