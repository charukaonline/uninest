import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import { Form, Input, Upload, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const HouseownerSignup2 = ({ onFinish, loading }) => {

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const onFinishFailed = (errorInfo) => {
        console.log("Form submission failed: ", errorInfo);
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append('residentialAddress', values.residentialAddress);
        formData.append('nationalIdCardNumber', values.nationalIdCardNumber);
        if (fileList[0]) {
            formData.append('nicDocument', fileList[0].originFileObj);
        }
        onFinish(formData);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-left">
                    Please verify yourself...
                </h2>

                <Form
                    form={form}
                    name="houseowner-verification"
                    onFinish={handleFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                >
                    <Form.Item
                        label="Residential Address"
                        name="residentialAddress"
                        rules={[
                            { required: true, message: "Please enter your residential address!" },
                        ]}
                    >
                        <Input
                            style={{
                                borderColor: "#006845",
                                borderWidth: "1px",
                                outline: "none",
                            }}
                            placeholder='Residential Address'
                        />
                    </Form.Item>

                    <Form.Item
                        label="National ID Card (NIC) Number"
                        name="nationalIdCardNumber"
                        rules={[
                            { required: true, message: "Please enter your national ID card number!" },
                        ]}
                    >
                        <Input
                            style={{
                                borderColor: "#006845",
                                borderWidth: "1px",
                                outline: "none",
                            }}
                            placeholder='National ID Card Number'
                        />
                    </Form.Item>

                    <Form.Item
                        label="NIC Document (PDF)"
                        name="nicDocument"
                        rules={[{ required: true, message: 'Please upload your NIC document!' }]}
                    >
                        <Upload.Dragger
                            accept=".pdf"
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setFileList(fileList)}
                            maxCount={1}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag NIC document to upload</p>
                            <p className="ant-upload-hint">Support for PDF files only</p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item>
                        <button
                            type="submit"
                            className="w-full bg-primaryBgColor hover:bg-green-700 text-white font-semibold p-3 rounded-lg disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Continue'}
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

HouseownerSignup2.propTypes = {
    onFinish: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default HouseownerSignup2;