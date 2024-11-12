import React, { useState } from "react";
import { Form, Input, Divider } from "antd";
import { FcGoogle } from "react-icons/fc";
import Btn from "./custombutton";

const StudentSignup1 = () => {
  const [form] = Form.useForm();
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [isSignUpHovered, setIsSignUpHovered] = useState(false);

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form failed:", errorInfo);
  };

  const googleButtonStyle = {
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
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-md">
          <div className="text-right text-xs">
            Already have an account? <a href="#" className="underline">Login Now</a>
          </div>
          <br />

          <button
              style={googleButtonStyle}
              onMouseEnter={() => setIsGoogleHovered(true)}
              onMouseLeave={() => setIsGoogleHovered(false)}
          >
            <FcGoogle className="mr-2" />
            <div className="font-bold text-base">Continue with Google</div>
          </button>

          <Divider className="my-6 sm:my-8" style={{ color: "black", borderColor: "black" }}>Or</Divider>

          <Form
              form={form}
              name="register"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">Create an Account</h2>

            <Form.Item
                label="Email Address"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
                label="User name"
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 8, message: "Password must be at least 8 characters long!" },
                ]}
                hasFeedback
            >
              <Input.Password />
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
                hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                        value
                            ? Promise.resolve()
                            : Promise.reject(new Error("You must accept the terms and conditions!")),
                  },
                ]}
            >
              <div className="mt-4 text-xs flex items-center">
                <input type="checkbox" id="checkbox" className="accent-green-700 mr-2" />
                <label htmlFor="checkbox">
                  By creating an account, I agree to our{" "}
                  <a href="#" className="underline">Terms of use</a> and <a href="#" className="underline">Privacy Policy</a>
                </label>
              </div>
            </Form.Item>

            <Form.Item>
              <div
                  onMouseEnter={() => setIsSignUpHovered(true)}
                  onMouseLeave={() => setIsSignUpHovered(false)}
              >
                <Btn
                    btnName="SignUp"
                    btnType="submit"
                    color="#006845"
                    hoverColor="#15803d"
                    className="w-full"
                    textColor={"white"}
                    hoverTextColor={"white"}
                />
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
  );
};

export default StudentSignup1;
