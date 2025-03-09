import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    NavLink,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { Layout } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { IoSettingsSharp } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";
import { FaInbox, FaSignOutAlt } from "react-icons/fa";
import ProfileSettings from "../student-dash-settings/ProfileSettings.jsx";
import UserDashboardListing from "../student-dash-listings/UserDashboardListing.jsx";
import Inbox from "../student-dash-chatui/Chatbox.jsx";

const { Header, Content, Footer } = Layout;

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
            >
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<UserDashboardListing />} />
                    <Route path="/Listings" element={<Inbox />} />
                    <Route path="/Settings" element={<ProfileSettings />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

function MobileApp() {
    const navigate = useNavigate();

    const navLinks = [
        { path: "/", label: "Listings", icon: <FiFileText size={22} /> },
        { path: "/Listings", label: "Inbox", icon: <FaInbox size={22} /> },
        { path: "/Settings", label: "Settings", icon: <IoSettingsSharp size={22} /> },
    ];

    const handleLogout = () => {
        console.log("Logging out...");

    };

    return (
        <Layout className="flex flex-col h-screen bg-[#F7F6F4]">
            {/* Header */}
            <Header className="bg-gradient-to-r from-[#E6F4EA] to-[#C6E6D1] p-4 shadow-md flex items-center justify-start">
                <div className="flex items-center">
                    {/* Profile Image */}
                    <div className="w-12 h-12 bg-[#A3DAB7] rounded-full border-2 border-[#16a34a]"></div>
                    {/* Text Content */}
                    <div className="ml-3">
                        <h2 className="font-semibold text-lg text-[#16a34a]">Indica Watson</h2>
                        <p className="text-sm text-[#2F855A]">Real Estate Builders</p>
                    </div>
                </div>
            </Header>

            {/* Main Content */}
            <Content className="overflow-auto flex-grow">
                <div className="bg-white rounded-lg shadow-xl p-6 min-h-[calc(100vh-160px)]">
                    <AnimatedRoutes />
                </div>
            </Content>

            {/* Bottom Navigation Bar */}
            <Footer className="fixed bottom-0 left-0 right-0 p-2 bg-gradient-to-r from-[#E6F4EA] to-[#C6E6D1] shadow-inner">
                <nav className="flex justify-around">
                    {navLinks.map(({ path, label, icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                isActive
                                    ? "flex flex-col items-center text-[#16a34a] font-semibold"
                                    : "flex flex-col items-center text-[#2F855A] hover:text-[#16a34a] transition-colors"
                            }
                        >
                            {icon}
                            <span className="text-xs mt-1">{label}</span>
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center text-[#2F855A] hover:text-[#16a34a] transition-colors"
                    >
                        <FaSignOutAlt size={22} />
                        <span className="text-xs mt-1">Logout</span>
                    </button>
                </nav>
            </Footer>
        </Layout>
    );
}

export default function DashboardMobile() {
    return (
        <Router>
            <MobileApp />
        </Router>
    );
}
