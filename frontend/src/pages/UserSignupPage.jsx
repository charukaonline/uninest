// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import UserSignupStep01 from "../components/signup_pages/UserSignupStep01";
import UserSignupStep02 from "../components/signup_pages/UserSignupStep02";

const UserSignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // Add this line

  const handleFirstStepSubmit = (values) => {
    setFormData((prevData) => ({ ...prevData, ...values }));
    // Store token and userId for second step
    localStorage.setItem("userId", values.userId);
    localStorage.setItem("token", values.token);
    setStep(2);
  };

  const handleSecondStepSubmit = (values) => {
    const completeData = { ...formData, ...values };
    // Log or store the complete user data if needed
    console.log("Registration completed with data:", completeData);

    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    // Redirect to login or dashboard
    navigate("/auth/user-signin"); // Now this will work
  };

  useEffect(() => {
    document.title = "UniNest | User Signup";
  }, []);

  return (
    <div>
      {step === 1 && <UserSignupStep01 onFinish={handleFirstStepSubmit} />}
      {step === 2 && <UserSignupStep02 onFinish={handleSecondStepSubmit} />}
    </div>
  );
};
export default UserSignupPage;
