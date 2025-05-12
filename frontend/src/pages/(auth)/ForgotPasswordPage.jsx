import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      notification.error({
        message: "Invalid Email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      // Store email in localStorage to use it in the next step
      localStorage.setItem("resetEmail", email);
      notification.success({
        message: "Email Sent",
        description: "Please check your email for the verification code",
      });
      navigate("/auth/reset-password");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-[#006845] rounded-2xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-white mb-6">Forgot Password</h2>
        <p className="text-gray-200 mb-6">
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-white text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-white text-black"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-[#006845] font-semibold p-3 rounded-xl hover:bg-gray-200 mb-4"
          >
            {isSubmitting ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Send Verification Code"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/auth/user-signin")}
            className="w-full text-white text-sm hover:underline"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
