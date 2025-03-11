import { Form, Input, Upload, message } from 'antd';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { PlusOutlined } from '@ant-design/icons';

const StudentSettings01 = () => {

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const onFinishFailed = (errorInfo) => {
        console.log('Form submission failed:', errorInfo);
    };

    const handleInformationSubmit = async (values) => {
        console.log('User Info Submitted:', values);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleImageUpload = ({ file }) => {
        // Handle the file upload manually instead of sending to an endpoint
        if (file.status === 'uploading') {
            // You can add loading state here if needed
        }
        if (file.status !== 'uploading') {
            // Update the fileList state
            setFileList([file]);
        }
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center">
            <PlusOutlined className="text-gray-500 text-3xl" />
            <div className="mt-2 text-gray-600">Upload</div>
        </div>
    );

    return (
        <div className="flex space-x-4 w-full mt-5">
            {/* Update User Info */}
            <div className="flex-1 bg-primaryBgColor p-6 rounded-lg shadow-md">
                <h1 className="text-base text-white font-semibold mb-4">Update User Information</h1>

                <Form
                    form={form}
                    name="user_info"
                    initialValues={{ remember: true }}
                    onFinish={handleInformationSubmit}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        className="[&_.ant-form-item-label>label]:text-white"
                        rules={[
                            { required: true, message: 'Please enter your username' },
                            { min: 3, message: 'Username must be at least 3 characters' }
                        ]}
                    >
                        <Input
                            placeholder="John Doe"
                            className="focus:border-primaryBgColor hover:border-primaryBgColor"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="phoneNumber"
                        className="[&_.ant-form-item-label>label]:text-white"
                        rules={[
                            { required: true, message: 'Please enter your contact number' },
                            { pattern: /^[+0-9\s-]+$/, message: 'Invalid phone number' }
                        ]}
                    >
                        <Input
                            placeholder="+94 77 123 4567"
                            className="focus:border-primaryBgColor hover:border-primaryBgColor"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="submit"
                            className="bg-white text-primaryBgColor px-6 py-2 rounded-lg focus:outline-none w-fit hover:bg-gray-200 font-semibold"
                        >
                            Update Information
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            {/* Update Profile Image */}
            <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-md">
                <h1 className="text-base font-semibold mb-4">Update Profile Image</h1>

                <Form layout="vertical" className="flex flex-col items-center">
                    <Form.Item>
                        <Upload
                            listType="picture-circle"
                            fileList={fileList}
                            onChange={handleImageUpload}
                            maxCount={1}
                            className="[&_.ant-upload-list-item-done]:!border-green-500 mt-6"
                            beforeUpload={beforeUpload}
                            customRequest={({ onSuccess }) => {
                                // Mock successful upload
                                setTimeout(() => {
                                    onSuccess("ok");
                                }, 0);
                            }}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item className="flex justify-center">
                        <Button
                            type="submit"
                            className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-fit hover:bg-green-700 font-semibold"
                        >
                            Update Profile Image
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default StudentSettings01