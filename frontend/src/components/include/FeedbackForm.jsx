import React, { useState } from "react";
import { Form, Input, Rate, Select, notification, Modal } from "antd";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const { Option } = Select;
const { TextArea } = Input;

const FeedbackForm = ({ isOpen, onClose, userType, userId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const feedbackData = {
                userId,
                userType, // "student", "landlord", or "admin"
                rating: values.rating,
                feedbackType: values.feedbackType,
                feedback: values.feedback,
                source: "app_sidebar", // to track where feedback came from
            };

            // You'll need to create this API endpoint on your backend
            const response = await axios.post(`${API_URL}/feedback/submit`, feedbackData);

            if (response.data.success) {
                notification.success({
                    message: "Success",
                    description: "Your feedback has been submitted successfully. Thank you!",
                });
                form.resetFields();
                onClose();
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "Failed to submit feedback",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="We Value Your Feedback"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={500}
            bodyStyle={{ padding: "24px" }}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="rating"
                    label="How would you rate your experience?"
                    rules={[{ required: true, message: "Please give a rating" }]}
                >
                    <Rate 
                        allowHalf 
                        className="text-primaryBgColor" 
                        style={{ fontSize: 32 }} 
                    />
                </Form.Item>

                <Form.Item
                    name="feedbackType"
                    label="What type of feedback do you have?"
                    rules={[{ required: true, message: "Please select a feedback type" }]}
                >
                    <Select placeholder="Select feedback type">
                        <Option value="suggestion">Suggestion</Option>
                        <Option value="bug">Bug Report</Option>
                        <Option value="compliment">Compliment</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="feedback"
                    label="Tell us more"
                    rules={[{ required: true, message: "Please provide your feedback" }]}
                >
                    <TextArea
                        rows={5}
                        placeholder="Please share your thoughts, ideas, or report issues..."
                        className="resize-none focus:border-primaryBgColor"
                    />
                </Form.Item>

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </button>
                </div>
            </Form>
        </Modal>
    );
};

export default FeedbackForm;
