import StudentSidebar from '@/components/student_dashboard/StudentSidebar'
import { Button } from '@/components/ui/button'
import { Form, Input } from 'antd'
import React, { useEffect } from 'react'

import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import { useState } from 'react';

const StdSettings = () => {

    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        document.title = 'Change Details'
    });

    const onFinishFailed = (errorInfo) => {
        console.log("Form submission failed:", errorInfo);
    };

    const handleInformationSubmit = async (values) => {
        console.log(values);
    };

    const handleChange = ({ fileList: newFileList }) => {
        const file = newFileList[0];
        if (file) {
            // Handle the image upload here
            console.log('Uploaded file:', file);
        }
        setFileList(newFileList);
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    return (
        <div className="flex h-screen w-full bg-white">
            <div><StudentSidebar /></div>

            <div className="flex-1" style={{ marginLeft: '220px', padding: '1rem' }}>
                <h1 className="text-xl font-bold mb-4">
                    Profile Settings
                </h1>

                <div className='flex space-x-4 w-full mt-5'>
                    <div className='flex-1 bg-gray-100 p-4 rounded-lg'>
                        <h1 className=' text-base font-semibold mb-4'>Update user information</h1>

                        <Form
                            form={form}
                            name="register"
                            initialValues={{ remember: true }}
                            onFinish={handleInformationSubmit}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                        >

                            <Form.Item
                                label="Username"
                                name="username"
                            >
                                <Input
                                    placeholder="John Doe"
                                    className=" focus:border-primaryBgColor hover:border-primaryBgColor"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Contact Number"
                                name="phoneNumber"

                            >
                                <Input
                                    placeholder="+94 77 123 4567"
                                    className=" focus:border-primaryBgColor hover:border-primaryBgColor"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="submit"
                                    block
                                    className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-fit hover:bg-green-700 font-semibold"
                                >
                                    Update Information
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className='flex-1 bg-gray-100 p-4 rounded-lg'>
                        <h1>Update profile image</h1>

                        <div className='flex items-center justify-center h-full'>
                            <Upload
                                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                listType="picture-circle"
                                fileList={fileList}
                                onChange={handleChange}
                                maxCount={1}
                                className="[&_.ant-upload-list-item-done]:!border-green-500"
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                block
                                className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-fit hover:bg-green-700 font-semibold"
                            >
                                Update Profile Image
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default StdSettings

{/* Password form items from comments */}
{/* <Form.Item
    label="Password"
    name="password"
    rules={[{ required: true, message: "Please input your password!" }, { min: 8, message: "Password must be at least 8 characters long!" }]}
>
    <Input.Password
        placeholder="Password"
        className=" focus:border-primaryBgColor hover:border-primaryBgColor"
    />
</Form.Item>

<Form.Item
    label="Confirm Password"
    name="confirmPassword"
    dependencies={["password"]}
    rules={[
        { required: true, message: "Please confirm your password!" },
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
            },
        }),
    ]}
>
    <Input.Password
        placeholder="Re-enter Password"
        className=" focus:border-primaryBgColor hover:border-primaryBgColor"
    />
</Form.Item> */}