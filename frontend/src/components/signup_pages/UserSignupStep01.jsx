// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { Form, Input, Divider, notification } from "antd";
import PropTypes from "prop-types";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import axios from "axios";

const UserSignupStep01 = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(false);

  const onFinishFailed = (errorInfo) => {
    console.log("Form submission failed:", errorInfo);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup/step1",
        values
      );
      onFinish({
        ...values,
        userId: response.data.userId,
        token: response.data.token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      notification.error({
        message: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-md">
        <div className="text-right text-xs">
          Already have an account?{" "}
          <a
            href="#"
            className="underline"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              navigate("/auth/user-signin"); // Redirect to the login route
            }}
          >
            Login Now
          </a>
        </div>
        <br />

        <button
          style={{
            backgroundColor: isGoogleHovered ? "#15803d" : "#006845",
            color: "white",
            borderRadius: "999px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            width: "100%",
            cursor: "pointer",
          }}
          onMouseEnter={() => setIsGoogleHovered(true)}
          onMouseLeave={() => setIsGoogleHovered(false)}
        >
          <FcGoogle className="mr-2" />
          <div className="font-bold text-base">Continue with Google</div>
        </button>

        <Divider
          className="my-6 sm:my-8"
          style={{ color: "black", borderColor: "black" }}
        >
          Or
        </Divider>

        <Form
          form={form}
          name="register"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            Create an Account
          </h2>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
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
            <Input.Password placeholder="Re-enter Password" />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("You must accept the terms and conditions!")
                      ),
              },
            ]}
          >
            <div className="mt-4 text-xs flex items-center">
              <input
                type="checkbox"
                id="checkbox"
                className="accent-green-700 mr-2"
              />
              <label htmlFor="checkbox">
                By creating an account, I agree to our{" "}
                <a href="#" className="underline">
                  Terms of use
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="submit"
              block
              className="bg-green-700 rounded-full w-full"
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

UserSignupStep01.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default UserSignupStep01;
