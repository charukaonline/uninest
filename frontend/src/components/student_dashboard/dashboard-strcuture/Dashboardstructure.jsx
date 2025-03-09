import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTachometerAlt, FaList, FaCog, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProfileSettings from "../student-dash-settings/ProfileSettings.jsx";
import UserDashboardListing from "../student-dash-listings/UserDashboardListing.jsx";
import Inbox from "../student-dash-chatui/chatbox.jsx";
import dashimage from "../../../public/ProfilePic/dashimage.jpeg";

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(true);

    const sidebarVariants = {
        open: { width: "260px", transition: { duration: 0.35, ease: "easeInOut" } },
        closed: { width: "80px", transition: { duration: 0.35, ease: "easeInOut" } },
    };

    return (
        <Router>
            <div className="flex h-screen bg-[#F7F6F4]">
                <motion.aside
                    variants={sidebarVariants}
                    animate={isOpen ? "open" : "closed"}
                    className="bg-gradient-to-b from-[#E6F4EA] to-[#C6E6D1] text-gray-900 shadow-lg flex flex-col relative"
                >
                    {/* Sidebar Toggle Button */}
                    <div
                        className="absolute top-1/2 right-[-12px] transform -translate-y-1/2 p-3 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <FaChevronLeft className="text-[#16a34a] text-xl" />
                        ) : (
                            <FaChevronRight className="text-[#16a34a] text-xl" />
                        )}
                    </div>

                    {/* Profile Section */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { duration: 0.35, ease: "easeOut" } }}
                        className={`flex flex-col items-center py-6 border-b border-[#A3DAB7] transition-all ${isOpen ? "px-4" : "px-2"}`}
                    >
                        <img
                            src={dashimage}
                            alt="Profile"
                            className="w-16 h-16 rounded-full shadow-lg"
                        />
                        {isOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                                <p className="mt-4 text-[#16a34a] font-semibold text-lg">Indica Watson</p>
                                <p className="text-[#2F855A] text-sm">Real Estate Builders</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Navigation Links */}
                    <nav className="flex-1 mt-6 space-y-1 px-2">
                        {[{ key: "1", path: "/", icon: <FaTachometerAlt />, label: "Listings" },
                            { key: "2", path: "/Listings", icon: <FaList />, label: "Inbox" },
                            { key: "3", path: "/Settings", icon: <FaCog />, label: "Settings" }]
                            .map(({ key, path, icon, label }) => (
                                <NavLink
                                    key={key}
                                    to={path}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "text-[#16a34a] font-bold flex items-center p-3 rounded-lg text-lg transition"
                                            : "flex items-center p-3 rounded-lg text-lg transition hover:text-[#16a34a] text-[#276749]"
                                    }
                                >
                                    <span className="text-2xl">{icon}</span>
                                    {isOpen && <span className="ml-4">{label}</span>}
                                </NavLink>
                            ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-full bg-[#16a34a] hover:bg-[#16a34a] text-white py-3 rounded-lg text-lg font-semibold transition"
                        >
                            <FaSignOutAlt />
                            {isOpen && <span className="ml-3">Log Out</span>}
                        </motion.button>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <MainContent />
            </div>
        </Router>
    );
}

const MainContent = () => {
    const location = useLocation();

    return (
        <motion.div className="flex-1 h-screen p-8 bg-white overflow-auto rounded-lg shadow-xl">
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
        </motion.div>
    );
};
