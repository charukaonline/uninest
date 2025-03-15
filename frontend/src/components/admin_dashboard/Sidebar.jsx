import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react";
import { FaUniversity } from "react-icons/fa";
import { RiLogoutBoxLine } from 'react-icons/ri';
import { notification } from "antd";
import { IoWarning } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const { adminId, email } = useParams();
  const { admin, adminLogout } = useAdminAuthStore();

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate("/auth/uninest-admin");
    } catch (error) {
      notification.error({
        message: 'Logout failed',
        description: 'An error occurred while trying to logout'
      });
    }
  }

  const isActive = (path) => location.pathname === path;

  const topMenuItems = [
    {
      icon: <LayoutDashboard />,
      label: "Dashboard",
      path: `/admin/${adminId}/${email}`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <Users />,
      label: "Manage Users",
      path: `/admin/${adminId}/${email}/users`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <Building2 />,
      label: "Manage Listings",
      path: `/admin/${adminId}/${email}/listings`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <FaUniversity />,
      label: "Add University",
      path: `/admin/${adminId}/${email}/add-university`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <BarChart3 />,
      label: "Analytics",
      path: `/admin/${adminId}/${email}/analytics`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <FileText />,
      label: "Reports",
      path: `/admin/${adminId}/${email}/reports`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <MessageSquare />,
      label: "Feedbacks",
      path: `/admin/${adminId}/${email}/feedbacks`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <MdEmail />,
      label: 'Email & Notification',
      path: `/admin/${adminId}/${email}/email-notification`,
      txtColor: '#7F7F7F'
    },
    {
      icon: <IoWarning />,
      label: 'Security & Access',
      path: `/admin/${adminId}/${email}/security-access`,
      txtColor: '#7F7F7F'
    }
  ];

  const lastMenuItems = [
    {
      icon: <RiLogoutBoxLine />,
      label: "Logout",
      txtColor: '#F10A0A',
      onclick: handleLogout
    },
  ];

  return (
    <div className="bg-[#181818] h-screen fixed w-60 border-r border-gray-300 p-4 flex flex-col">

      <div className="p-2">
        <h2 className="text-2xl font-bold text-white">UniNest Admin</h2>
      </div>

      <ul className=" mt-8 space-y-3">
        {topMenuItems.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
              className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#030303] border-r-4 border-green-500" : "hover:text-white"}`}
            >
              <span className=' text-lg'>{link.icon}</span>
              <span className=' text-base'>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ul>
        {lastMenuItems.map((link, index) => (
          <li key={index}>
            {
              link.label === 'Logout' ? (
                <button
                  onClick={handleLogout}
                  style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
                  className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#212121] border-r-4 border-green-500" : "hover:text-white"}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-base">{link.label}</span>
                </button>
              ) : (
                <Link
                  to={link.path}
                  style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
                  className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#212121] border-r-4 border-green-500" : "hover:text-white"}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-base">{link.label}</span>
                </Link>
              )
            }
          </li>
        ))}
      </ul>

    </div>
  );
}
