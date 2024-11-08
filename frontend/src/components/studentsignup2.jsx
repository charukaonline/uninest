import React, { useState } from "react";
import { Form, Input } from "antd";
import Btn from "./button"; 

const StudentSignup2 = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form submitted:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form submission failed:", errorInfo);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-6 text-left">
          By the way, which Uni?
        </h2>
        <Form
          form={form}
          name="universityForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Please enter the university you belong to"
            name="university"
            rules={[{ required: true, message: "Please enter your university" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Btn
              btnName="Continue"
              btnType="button"
              color="#006845"
              hoverColor="#15803d"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default StudentSignup2;
