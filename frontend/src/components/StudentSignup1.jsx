import React from "react";
import { Form, Input, Button, Divider } from "antd";
import { FcGoogle } from "react-icons/fc";

const StudentSignup1 = () => {
  const [form] = Form.useForm(); // Create a form instance

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <div className="mt-4 text-right text-xs">
          Already have an account? <a href="#" className="underline">Login Now</a>
        </div><br />
        <Button
          type="primary"
          icon={<FcGoogle />}
          block
          className="mb-4 bg-green-800 rounded-full"
        >
          Continue with Google
        </Button>

        <Divider className="my-8" style={{ color: "black", borderColor: "black" }}>Or</Divider>

        <Form
          form={form} // Bind the form instance
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <h2 className="text-xl font-semibold mb-4">Create an Account</h2>
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
            dependencies={['password']}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
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
              <input
                type="checkbox"
                id="checkbox"
                className="accent-green-700 mr-2"
              />
              <label htmlFor="checkbox">
                By creating an account, I agree to our{" "}
                <a href="#" className="underline">Terms of use</a> and <a href="#" className="underline">Privacy Policy</a>
              </label>
            </div>
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                block
                className="mb-4 bg-green-700 rounded-full"
                disabled={
                  !form.isFieldsTouched(true) || // Check if fields have been touched
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0 // Check for validation errors
                }
              >
                SignUp
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default StudentSignup1;
