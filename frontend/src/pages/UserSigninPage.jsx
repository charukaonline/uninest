// src/components/LoginRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { BiShow, BiHide } from "react-icons/bi";
import axios from "axios";
import { notification } from "antd";

function UserSigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const navigate = useNavigate();

  // Simple validation for login form
  const validateLogin = () => {
    const errors = {};
    if (!loginData.email.includes("@")) errors.email = "Enter a valid email";
    if (loginData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Google Sign-In (Placeholder function)
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In triggered");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/signin",
          {
            email: loginData.email,
            password: loginData.password,
          }
        );

        // Store token and user data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        notification.success({
          message: "Login Successful",
          description: "Welcome back to UniNest!",
        });

        // Redirect to home page
        navigate("/");
      } catch (error) {
        notification.error({
          message: "Login Failed",
          description: error.response?.data?.message || "Invalid credentials",
        });
      }
    }
  };

  const handleSignupRedirect = () => {
    navigate("/auth/user-signup"); // Navigate to the User Signup Page
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative flex flex-col w-full max-w-md bg-[#006845] font-poppins shadow-2xl rounded-2xl mx-auto">
        <div className="flex flex-col justify-center p-10">
          <h2 className="mb-1 text-4xl font-bold text-white">Welcome Back</h2>
          <p className="font-light text-gray-400 mb-8">
            Welcome back! Please enter your details
          </p>

          {/* Google Login Button */}
          <button
            className="w-full flex items-center justify-center border border-gray-300 p-2 rounded-full text-gray-700 bg-white hover:bg-gray-200 mb-6"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            Continue with Google
          </button>

          {/* Separator */}
          <div className="flex items-center mb-6">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-sm text-white">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Form Fields */}
          <form onSubmit={handleLoginSubmit}>
            <div className="py-2">
              <label className="text-sm text-white">
                User name or email address
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-[#004d3f] text-white placeholder-gray-400"
                placeholder="Enter your email"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              {loginErrors.email && (
                <p className="text-sm text-red-500">{loginErrors.email}</p>
              )}
            </div>

            <div className="py-2">
              <label className="text-sm text-white">Your password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-[#004d3f] text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center text-white cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BiShow /> : <BiHide />}
                </span>
              </div>
              {loginErrors.password && (
                <p className="text-sm text-red-500">{loginErrors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <button className="text-sm font-semibold text-white hover:underline">
                Forgot your password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-white text-[#006845] font-semibold p-3 rounded-full mb-6 hover:bg-gray-200"
            >
              Login Now
            </button>
          </form>

          {/* Redirect to Register */}
          <div className="text-center text-gray-200">
            Don&apos;t have an account?
            <button
              className="font-bold text-white hover:underline ml-1"
              onClick={handleSignupRedirect}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSigninPage;
