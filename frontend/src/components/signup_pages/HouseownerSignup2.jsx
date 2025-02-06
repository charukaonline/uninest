import React, { useEffect } from 'react'
import PropTypes from "prop-types";
import { Form, Input, notification } from "antd";

const HouseownerSignup2 = ({ onFinish, loading }) => {

    const [form] = Form.useForm();

    const onFinishFailed = (errorInfo) => {
        console.log("Form submission failed: ", errorInfo);
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
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
                    onFinish={onFinish}
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