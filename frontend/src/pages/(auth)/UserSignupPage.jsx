import React, { useState } from "react";
import { Form, Input, Divider, notification } from "antd";
import PropTypes from "prop-types";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const UserSignupPage = () => {
  const [form] = Form.useForm();
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const { signup, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const onFinishFailed = (errorInfo) => {
    console.log("Form submission failed:", errorInfo);
  };

  const handleSubmit = async (values) => {

    try {

      await signup(values.email, values.password, values.username);

      notification.success({
        message: "Registration Successful",
        description: "You have successfully registered!",
      });

      navigate("/auth/email-verify");

    } catch (error) {
      console.error("Registration error:", error);
      notification.error({
        message: "Registration Failed",
        description: error?.response?.data?.message || "Something went wrong",
      });

    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google"; // Google login API endpoint
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-2xl">
        <div className="text-right text-sm">
          Already have an account?{" "}
          <a
            href="#"
            className="underline text-primaryBgColor hover:text-green-700 font-semibold text-[13px]"
            onClick={(e) => {
              e.preventDefault();
              // Optional: You can add login redirect logic here if needed
            }}
          >
            Login Now
          </a>
        </div>
        <br />

        <button
          onClick={handleGoogleSignIn}
          className={`flex items-center justify-center w-full px-3 py-2 rounded-full cursor-pointer border-none ${isGoogleHovered ? "bg-green-700" : "bg-primaryBgColor"
            } text-white`}
          onMouseEnter={() => setIsGoogleHovered(true)}
          onMouseLeave={() => setIsGoogleHovered(false)}
        >
          <FcGoogle className="mr-2 size-6" />
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
          <h2 className="text-2xl font-bold mb-4 text-center">
            Create an Account
          </h2>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}

          >
            <Input
              placeholder="Email Address"
              className=" focus:border-primaryBgColor hover:border-primaryBgColor"
            />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}

          >
            <Input
              placeholder="Username"
              className=" focus:border-primaryBgColor hover:border-primaryBgColor"
            />
          </Form.Item>

          <Form.Item
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
              <label htmlFor="checkbox" className=" font-semibold text-sm">
                By creating an account, I agree to our{" "}
                <a
                  href="/privacy-policy"
                  className="underline text-primaryBgColor hover:text-green-700"
                >
                  Terms of use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="underline text-primaryBgColor hover:text-green-700"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="submit"
              block
              className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-full hover:bg-green-700 font-semibold"
              loading={isLoading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

UserSignupPage.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default UserSignupPage;
