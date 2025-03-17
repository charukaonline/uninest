import { useAuthStore } from "@/store/authStore";
import { notification } from "antd";
import React from "react";
import { FaBell, FaInbox } from "react-icons/fa";
import { IoMdHelpCircle } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdDashboard, MdFeedback } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useChat } from "@/contexts/ChatContext";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, email } = useParams();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useChat();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/user-signin");
    } catch (error) {
      notification.error({
        message: "Logout failed",
        description: "An error occurred while trying to logout",
      });
    }
  };

  const isActive = (path) => location.pathname === path;

  const topLinks = [
    {
      name: "Dashboard",
      path: `/student/${userId}/${email}`,
      icon: <MdDashboard />,
      txtColor: "#7F7F7F",
    },
    {
      name: "Inbox",
      path: `/student/${userId}/${email}/inbox`,
      icon: <FaInbox />,
      txtColor: "#7F7F7F",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      name: "Notifications",
      path: `/student/${userId}/${email}/notification`,
      icon: <FaBell />,
      txtColor: "#7F7F7F",
    },
    {
      name: "Settings",
      path: `/student/${userId}/${email}/settings`,
      icon: <IoSettings />,
      txtColor: "#7F7F7F",
    },
  ];

  const lastLinks = [
    {
      name: "Give Feedback",
      path: `/student/${userId}/${email}/feedback`,
      icon: <MdFeedback />,
      txtColor: "#7F7F7F",
    },
    {
      name: "Help & Support",
      path: `/student/${userId}/${email}/help-support`,
      icon: <IoMdHelpCircle />,
      txtColor: "#7F7F7F",
    },
    {
      name: "Logout",
      icon: <RiLogoutBoxLine />,
      txtColor: "#F10A0A",
      onclick: handleLogout,
    },
  ];

  return (
    <div className="bg-[#181818] h-screen fixed w-52 border-r border-gray-300 p-4 flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-2">
        <div className=" w-14 h-14 flex items-center justify-center rounded-full bg-primaryBgColor text-white text-xl font-bold">
          {user.email ? user.email.charAt(0).toUpperCase() : "U"}
        </div>
        <h1 className="text-xl font-semibold text-white">{user.username}</h1>
      </div>

      {/* Link Section */}
      <ul className=" mt-8 space-y-3">
        {topLinks.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              style={{ color: isActive(link.path) ? "#FFFFFF" : link.txtColor }}
              className={`flex items-center gap-5 p-1 rounded ${
                isActive(link.path)
                  ? "bg-[#030303] border-r-4 border-green-500"
                  : "hover:text-white"
              }`}
            >
              <span className=" text-lg">{link.icon}</span>
              <span className=" text-base">{link.name}</span>
              {link.badge && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-auto space-y-3 mb-4">
        {lastLinks.map((link, index) => (
          <li key={index}>
            {link.name === "Logout" ? (
              <button
                onClick={handleLogout}
                style={{
                  color: isActive(link.path) ? "#FFFFFF" : link.txtColor,
                }}
                className={`flex items-center gap-5 p-1 rounded ${
                  isActive(link.path)
                    ? "bg-[#212121] border-r-4 border-green-500"
                    : "hover:text-white"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-base">{link.name}</span>
              </button>
            ) : (
              <Link
                to={link.path}
                style={{
                  color: isActive(link.path) ? "#FFFFFF" : link.txtColor,
                }}
                className={`flex items-center gap-5 p-1 rounded ${
                  isActive(link.path)
                    ? "bg-[#212121] border-r-4 border-green-500"
                    : "hover:text-white"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-base">{link.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentSidebar;
