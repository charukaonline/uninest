import { Form, Input } from 'antd';
import React, { useState } from 'react'
import { Button } from '../ui/button';

const StudentSettings02 = () => {

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const onFinishFailed = (errorInfo) => {
        console.log('Form submission failed:', errorInfo);
    };

    const handlePasswordSubmit = async (values) => {
        console.log('Password change submitted:', values);
    };

    const handleDeactivateSubmit = async () => {
        console.log('Account deactivation requested');
    };

    const handleDeleteSubmit = async (values) => {
        console.log('Account deletion requested:', values);
    };

    return (
        <div className="flex space-x-4 w-full mt-5">
            {/* Change Password */}
            <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-md">
                <h1 className="text-base font-semibold mb-4">Change Password</h1>

                <Form
                    name="change_password"
                    onFinish={handlePasswordSubmit}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: "Please input your password!" }, { min: 8, message: "Password must be at least 8 characters long!" }]}
                    >
                        <Input.Password
                            placeholder="Current Password"
                            className="focus:border-primaryBgColor hover:border-primaryBgColor"
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[{ required: true, message: "Please input your password!" }, { min: 8, message: "Password must be at least 8 characters long!" }]}
                    >
                        <Input.Password
                            placeholder="New Password"
                            className="focus:border-primaryBgColor hover:border-primaryBgColor"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Re-enter Password"
                            className="focus:border-primaryBgColor hover:border-primaryBgColor"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="submit"
                            className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-fit hover:bg-green-700 font-semibold"
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div className="flex-1 bg-primaryBgColor p-6 rounded-lg shadow-md">
                <h1 className="text-base text-white font-semibold mb-4">Delete or Deactivate Account</h1>

                {/* Deactivate Account Button */}
                <Button
                    onClick={handleDeactivateSubmit}
                    className="border border-red-500 bg-white text-black px-6 py-2 rounded-lg focus:outline-none w-fit hover:bg-red-500 hover:text-white font-semibold"
                >
                    Temporary Deactivate Account
                </Button>

                {/* Delete Account Form */}
                <Form
                    name="delete_account"
                    onFinish={handleDeleteSubmit}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    className="mt-4"
                >
                    <Button
                        type="submit"
                        className=" bg-red-500 text-white px-6 py-2 rounded-lg focus:outline-none w-fit hover:bg-red-600 font-semibold"
                    >
                        Permanently Delete Account
                    </Button>

                    <Form.Item
                        name="delete_reason"
                        label="Why you leaving us?"
                        className="[&_.ant-form-item-label>label]:text-white mt-5"
                        rules={[{ required: true, message: 'Please explain clearly' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Explain the reason why you leaving..."
                            className="resize-none focus:border-primaryBgColor"
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default StudentSettings02