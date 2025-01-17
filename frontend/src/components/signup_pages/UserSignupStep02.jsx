// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, notification } from "antd";
import CustomButton from "../CustomBtn";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

const UserSignupStep02 = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinishFailed = (errorInfo) => {
    console.log("Form submission failed:", errorInfo);
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
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-left">
          By the way, which Uni?
        </h2>
        <Form
          form={form}
          name="universityForm"
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Please enter the university you belong to"
            name="university"
            rules={[
              { required: true, message: "Please enter your university" },
            ]}
            className={"font-medium"}
          >
            <Input
              style={{
                borderColor: "#006845",
                borderWidth: "1px",
                outline: "none",
              }}
              placeholder="University"
            />
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-full hover:bg-green-700 font-semibold"
              loading={loading}
            >
              Continue
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
UserSignupStep02.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default UserSignupStep02;
