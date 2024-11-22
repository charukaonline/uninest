// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Form, Input, notification } from "antd";
import CustomButton from "../CustomBtn";
import "react-phone-input-2/lib/style.css";

const UserSignupStep02 = ({ onFinish }) => {
  const [form] = Form.useForm();

  const onFinishFailed = (errorInfo) => {
    console.log("Form submission failed:", errorInfo);
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-lg rounded-md">
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
            <CustomButton
              btnName="Continue"
              btnType="primary"
              htmlType="submit"
              color="#006845"
              textColor={"white"}
              hoverTextColor={"white"}
              hoverColor="#15803d"
              onClick={() =>
                openNotification(
                  "success",
                  "Registration Successful",
                  "Your account has been created successfully!"
                )
              }
            />
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
