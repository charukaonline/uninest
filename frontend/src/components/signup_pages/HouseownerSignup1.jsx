import React, { useState } from 'react';
import { Form, Input } from 'antd';
import 'antd/dist/reset.css';
import Btn from "./custombutton.jsx";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const SignupForm = () => {
  const [form] = Form.useForm();
  // const [hovered, setHovered] = useState(false);

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const lightGreenThemeColor = '#c0e0b2';
  const greenThemeColor = '#006845';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-md">
        <div className="mt-4 text-right text-xs">
          Already have an account? <a href="#" className="underline">Login Now</a>
        </div>
        <br />
        <h2 className="text-2xl font-semibold mb-6 text-left">Create an Account</h2>
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
            rules={[{ required: true, message: 'Please input your email!' }]}
            className="font-medium"
          >
            <Input 
              style={{
                borderColor: greenThemeColor, 
                borderWidth: "1px", 
                outline: "none", 
              }}  
              placeholder="Email Address"
            />
          </Form.Item>

          <Form.Item
            label="User name"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            className="font-medium"
          >
            <Input 
              style={{
                borderColor: greenThemeColor, 
                borderWidth: "1px", 
                outline: "none", 
              }}  
              placeholder="User name"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
            className="font-medium"
          >
            <PhoneInput
              country={'lk'}
              inputStyle={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                borderColor: lightGreenThemeColor,
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = greenThemeColor)}
              onBlur={(e) => (e.target.style.borderColor = lightGreenThemeColor)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters long!' },
            ]}
            hasFeedback
            className="font-medium"
          >
            <Input.Password 
              style={{
                borderColor: greenThemeColor, 
                borderWidth: "1px", 
                outline: "none", 
              }}  
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
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
            className="font-medium"
          >
            <Input.Password 
              style={{
                borderColor: greenThemeColor, 
                borderWidth: "1px", 
                outline: "none", 
              }}  
              placeholder="Confirm Password" 
            />
          </Form.Item>

          <Form.Item>
            <Btn
              btnName="Continue"
              btnType="submit"
              color={greenThemeColor}
              hoverColor="white"
              hoverTextColor="white"
              className="w-full"
              textColor="white"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
