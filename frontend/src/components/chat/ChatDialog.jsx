import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useLandlordAuthStore } from "@/store/landlordAuthStore";
import { Input, notification } from "antd";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BiSolidConversation } from "react-icons/bi";

/**
 * A reusable dialog component for starting conversations
 * @param {Object} props
 * @param {string} props.propertyId - ID of the property
 * @param {string} props.landlordId - ID of the landlord
 * @param {string} props.propertyName - Name of the property
 * @param {React.ReactNode} props.trigger - Custom trigger element
 * @param {string} props.className - Additional classes
 * @param {string} props.buttonText - Text for the button
 */
export function ChatDialog({
  propertyId,
  landlordId,
  propertyName,
  trigger,
  className = "",
  buttonText = "Start Conversation",
}) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { startNewConversation, currentUserType } = useChat();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthStore();
  const { landlord } = useLandlordAuthStore();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      notification.warning({
        message: "Message Required",
        description: "Please enter a message to start the conversation.",
      });
      return;
    }

    if (currentUserType === "landlord") {
      notification.info({
        message: "Cannot Start Conversation",
        description:
          "As a landlord, you cannot start a conversation with another landlord.",
      });
      return;
    }

    setIsSending(true);
    try {
      const conversation = await startNewConversation(
        landlordId,
        propertyId,
        message
      );

      if (conversation) {
        setIsOpen(false);

        // Navigate to inbox with the new conversation
        const path =
          currentUserType === "user"
            ? `/student/${user._id}/${user.email}/inbox`
            : `/landlord/${landlord._id}/${landlord.email}/inbox`;

        notification.success({
          message: "Conversation Started",
          description: `You've started a conversation about ${propertyName}`,
        });

        navigate(path);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to start conversation. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenChange = (open) => {
    if (!isAuthenticated) {
      notification.info({
        message: "Authentication Required",
        description:
          "Please sign in to start a conversation with this landlord.",
      });
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            className={`flex items-center justify-center gap-2 ${className}`}
          >
            <BiSolidConversation className="text-white" />
            {buttonText}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Conversation about {propertyName}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            Start a conversation with the landlord about this property.
          </p>
          <Input.TextArea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I'm interested in this property. Is it still available?"
            className="mb-4"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            className="bg-primaryBgColor hover:bg-green-700"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChatDialog;
