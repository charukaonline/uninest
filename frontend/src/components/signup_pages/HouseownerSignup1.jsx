import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Form, Input, Divider } from "antd";

const HouseownerSignup1 = ({ onFinish, loading }) => {

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-2xl">
        <div className="mt-4 text-right text-xs">
          Already have an account?{" "}
          <a
            className="underline text-primaryBgColor hover:text-green-700 font-semibold text-[13px]"
            onClick={(e) => {
              e.preventDefault();
              navigate("/auth/houseowner-signin")
            }}
          >
            Login Now
          </a>
        </div>
        <br />
        <h2 className="text-2xl font-semibold mb-6 text-left">
          Create an Account
        </h2>
        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              className=" focus:border-primaryBgColor hover:border-primaryBgColor"
              placeholder="Email Address"
            />
          </Form.Item>

          <Form.Item
            label="User name"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input
              className=" focus:border-primaryBgColor hover:border-primaryBgColor"
              placeholder="User name"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input
              className=" focus:border-primaryBgColor hover:border-primaryBgColor"
              placeholder="Ex: +94 77 123 4567"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              className=" focus:border-primaryBgColor hover:border-primaryBgColor"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
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
            hasFeedback
          >
            <Input.Password
              className=" focus:border-primaryBgColor hover:border-primaryBgColor"
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-full hover:bg-green-700 font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

HouseownerSignup1.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool
}

export default HouseownerSignup1