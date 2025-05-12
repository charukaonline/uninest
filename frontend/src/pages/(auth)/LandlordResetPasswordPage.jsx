import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { BiShow, BiHide } from "react-icons/bi";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

const LandlordResetPasswordPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Get email from localStorage
  const email = localStorage.getItem("landlordResetEmail");

  useEffect(() => {
    document.title = "UniNest | Reset Password";

    // If no email is stored, redirect to forgot password page
    if (!email) {
      notification.error({
        message: "Error",
        description: "Please submit your email first",
      });
      navigate("/auth/landlord-forgot-password");
    }
  }, [email, navigate]);

  const handleCodeChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      // Handle paste event
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last field or the next empty field
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      // Handle single character input
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input if current one is filled
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP and password
    const otp = code.join("");
    if (otp.length !== 6) {
      notification.error({
        message: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
      });
      return;
    }

    if (password.length < 8) {
      notification.error({
        message: "Password Too Short",
        description: "Password must be at least 8 characters long",
      });
      return;
    }

    if (password !== confirmPassword) {
      notification.error({
        message: "Passwords Do Not Match",
        description: "Please make sure your passwords match",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/landlord/reset-password`, {
        email,
        code: otp,
        password,
      });

      if (response.data.success) {
        notification.success({
          message: "Password Reset Successful",
          description: "Your password has been reset successfully",
        });
        localStorage.removeItem("landlordResetEmail");
        navigate("/auth/houseowner-signin");
      } else {
        throw new Error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Invalid or expired code",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-[#006845] rounded-2xl shadow-2xl p-10">
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-gray-200 mb-6">
          Enter the verification code sent to {email || "your email"} and create
          a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm mb-2">
              Verification Code
            </label>
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-12 text-center text-xl font-bold bg-white text-black border rounded-md"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-white text-black pr-10"
                placeholder="Enter new password"
                required
                minLength="8"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-black cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiShow size={20} /> : <BiHide size={20} />}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-white text-black"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-[#006845] font-semibold p-3 rounded-xl hover:bg-gray-200"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-4 border-t-transparent border-[#006845] rounded-full animate-spin mx-auto"></div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandlordResetPasswordPage;
