import React, { useState } from "react";
import { Modal, Input, Button, notification } from "antd";
import { useChat } from "@/contexts/ChatContext";
import { useNavigate, useParams } from "react-router-dom";
import { BiSolidConversation } from "react-icons/bi";

const StartConversationButton = ({
  propertyId,
  landlordId,
  propertyName,
  className = "",
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { startNewConversation, currentUserType } = useChat();
  const navigate = useNavigate();
  const { userId, email } = useParams();

  const handleStartConversation = async () => {
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

    setLoading(true);
    try {
      const conversation = await startNewConversation(
        landlordId,
        propertyId,
        message
      );
      setIsModalVisible(false);

      // Navigate to inbox with the new conversation
      if (conversation) {
        const path =
          currentUserType === "user"
            ? `/student/${userId}/${email}/inbox`
            : `/landlord/${userId}/${email}/inbox`;

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
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className={`flex items-center justify-center gap-2 ${className}`}
        onClick={() => setIsModalVisible(true)}
      >
        <BiSolidConversation className="text-black" />
        Start Conversation
      </Button>

      <Modal
        title={`Start Conversation about ${propertyName}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="py-4">
          <p className="mb-4">
            Start a conversation with the landlord about this property.
          </p>
          <Input.TextArea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I'm interested in this property. Is it still available?"
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleStartConversation}
              loading={loading}
              style={{ backgroundColor: "#006845" }}
            >
              Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StartConversationButton;
