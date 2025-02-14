import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { Form, Input, notification } from "antd";
import { landlordAuth } from "@/services/api";

const HouseownerSigninPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        console.log("Google Sign-In triggered");
    };

    const handleSignupRedirect = () => {
        navigate("/auth/houseowner-signup");
    };

    const handleLoginSubmit = async (values) => {
        try {
            const response = await landlordAuth.signin(values);
            
            if (response.user.verificationStatus === "pending") {
                navigate("/auth/verification-pending");
                return;
            }

            // Store token and user data in your auth context/local storage
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));

            // Redirect to landlord dashboard
            // navigate(`/landlord/${userId}/${email}`);
        } catch (error) {
            notification.error({
                message: "Login Failed",
                description: error.response?.data?.message || "Something went wrong"
            });
        }
    };

    useEffect(() => {
        document.title = "UniNest | House Owner Login";
    }, []);

    return (
        <div className="flex items-center justify-center p-4">
            <div className="relative flex flex-col w-full max-w-md bg-[#006845] font-poppins shadow-2xl rounded-2xl mx-auto">
                <div className="flex flex-col justify-center p-10">
                    <h2 className="mb-1 text-2xl font-bold text-white">Welcome Back!</h2>
                    <p className="font-light text-gray-400 mb-8">
                        Please enter your credentials to continue
                    </p>

                    <Form
                        layout="vertical"
                        onFinish={handleLoginSubmit}
                        requiredMark={true}
                        style={{ color: "white" }}
                    >
                        <Form.Item
                            label={<span className="text-white">User name or email address</span>}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email",
                                },
                                {
                                    type: "email",
                                    message: "Enter a valid email",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter your email"
                                className="bg-white text-black placeholder-gray-400 focus:border-primaryBgColor hover:border-primaryBgColor"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-white">Your password</span>}
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                },
                                {
                                    min: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                className="bg-white text-black placeholder-gray-600 focus:border-primaryBgColor hover:border-primaryBgColor"
                                iconRender={(visible) =>
                                    visible ? (
                                        <BiShow className="text-white" />
                                    ) : (
                                        <BiHide className="text-white" />
                                    )
                                }
                            />
                        </Form.Item>

                        <div className="flex justify-end mb-6">
                            <button
                                type="submit"
                                className="text-sm font-semibold text-white hover:text-[#eee] hover:underline"
                            >
                                Forgot your password?
                            </button>
                        </div>

                        <Form.Item>
                            <button
                                type="submit"
                                className="bg-white text-primaryBgColor px-6 py-2 rounded-lg focus:outline-none w-full hover:bg-white-[#eee] font-semibold"
                            >
                                Login Now
                            </button>
                        </Form.Item>
                    </Form>

                    <div className="text-center text-gray-200 text-sm">
                        Don&apos;t have an account as a house owner ?
                        <button
                            className="font-semibold text-white hover:underline ml-1 text-sm"
                            onClick={handleSignupRedirect}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HouseownerSigninPage