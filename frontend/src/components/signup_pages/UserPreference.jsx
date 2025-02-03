import { Form, Input, notification, Select } from 'antd';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import axios from 'axios';

const UserPreference = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const greenThemeColor = "#006845";

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
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:5000/api/auth/signup/step2/${userId}`,
                values,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            openNotification(
                "success",
                "Registration Successful",
                "Your account has been created successfully!"
            );

            onFinish(values);
        } catch (error) {
            console.error("Profile completion error:", error);
            openNotification(
                "error",
                "Registration Failed",
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-xl">
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
                </Form>
            </div>
        </div>
    );
}

export default UserPreference