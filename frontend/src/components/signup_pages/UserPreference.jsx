import { Form, Input, notification, Select, Modal } from 'antd';
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button';
import axios from 'axios';

const UserPreference = ({ isVisible, onClose, userId, token }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const greenThemeColor = "#006845";
    const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Use provided userId and token or fallback to localStorage
            const finalToken = token || localStorage.getItem("token");
            const finalUserId = userId || localStorage.getItem("userId");

            // Use the new preference endpoint with userId in body as fallback
            await axios.post(
                `${API_URL}/preferences/save`,
                { 
                    ...values,
                    userId: finalUserId // Include userId in body as fallback
                },
                {
                    headers: { 
                        Authorization: `Bearer ${finalToken}`,
                    }
                }
            );

            openNotification(
                "success",
                "Preferences Saved",
                "Your preferences have been saved successfully!"
            );

            // Set localStorage to prevent showing the modal again
            localStorage.setItem("hasCompletedPreferences", "true");
            
            if (onClose) onClose(values);
        } catch (error) {
            console.error("Profile completion error:", error);
            openNotification(
                "error",
                "Saving Failed",
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Complete Your Profile"
            open={isVisible}
            onCancel={onClose}
            footer={null}
            closable={false}
            maskClosable={false}
            width={500}
            centered
        >
            <div className="p-4">
                <h2 className="text-2xl font-semibold mb-6">Student Details</h2>
                <Form
                    form={form}
                    name="studentDetails"
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                >
                    <Form.Item
                        label="Which university are you studying at?"
                        name="university"
                        rules={[
                            { required: true, message: "Please enter your university name" },
                        ]}
                    >
                        <Input
                            style={{
                                borderColor: greenThemeColor,
                                borderWidth: "1px",
                            }}
                            placeholder="Enter your university name"
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button
                            type="submit"
                            className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-full hover:bg-green-700 font-semibold"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Preferences"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default UserPreference