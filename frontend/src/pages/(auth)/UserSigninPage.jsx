// src/components/LoginRegister.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { BiShow, BiHide } from "react-icons/bi";
import { notification } from "antd";

import { Loader } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

function UserSigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const navigate = useNavigate();

  const { login, isLoading, error } = useAuthStore();

  useEffect(() => {
    document.title = "UniNest | User Login";
  }, []);

  // Simple validation for login form
  const validateLogin = () => {
    const errors = {};
    if (!loginData.email.includes("@")) errors.email = "Enter a valid email";
    if (loginData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Google Sign - In(Placeholder function)
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In triggered");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;

    if (!validateLogin()) return;

    const userResponse = await login(email, password);

    console.log("Full Response:", userResponse);
    console.log("Extracted User ID:", userResponse?.user?._id);

    if (userResponse?.success === false) {
      notification.error({
        message: "Login Failed",
        description: userResponse.message || "Invalid credentials",
        duration: 3,
      });
      return;
    }

    const userId = userResponse?.user?._id;

    if (!userId) {
      notification.error({
        message: "Login Error",
        description: "User ID not found",
        duration: 3,
      });
      return;
    }

    navigate(`/sd/${userId}/${email}`);
  };

  const handleSignupRedirect = () => {
    navigate("/auth/user-signup"); // Navigate to the User Signup Page
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative flex flex-col w-full max-w-md bg-[#006845] font-poppins shadow-2xl rounded-2xl mx-auto">
        <div className="flex flex-col justify-center p-10">
          <h2 className="mb-1 text-2xl font-bold text-white">Welcome Back!</h2>
          <p className="font-light text-gray-400 mb-8">
            Please enter your credentials to continue
          </p>

          {/* Google Login Button */}
          <button
            className="w-full flex items-center justify-center border border-gray-300 p-2 rounded-full text-gray-700 bg-white hover:bg-gray-200 mb-6 font-bold"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            Continue with Google
          </button>

          <div className="flex items-center mb-6">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-sm text-white">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          <form onSubmit={handleLoginSubmit}>
            <div className="py-2">
              <label className="text-sm text-white">
                <strong className=" text-red-500 text-lg">*</strong> Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full h-8 p-3 mt-1 border rounded-md bg-white text-black placeholder-gray-400 focus:border-primaryBgColor hover:border-primaryBgColor text-sm"
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
              <label className="text-sm text-white"><strong className=" text-red-500 text-lg">*</strong> Your password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full h-8 p-3 mt-1 border rounded-md bg-white text-black placeholder-gray-400 focus:border-primaryBgColor hover:border-primaryBgColor text-sm"
                  placeholder="Enter your password"
                  required
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center text-black cursor-pointer"
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
            <div className="flex justify-end mb-6 mt-1">
              <button className="text-sm font-semibold text-white hover:underline">
                Forgot your password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-white text-[#006845] font-semibold p-3 rounded-xl mb-6 hover:bg-gray-200 text-sm"
              disabled={isLoading}
            >
              {isLoading ? <Loader className=' w-6 h-6 animate-spin mx-auto' /> : "Login Now"}
            </button>
          </form>

          {/* Redirect to Register */}
          <div className="text-center text-gray-200 text-sm">
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
