import { useState } from "react";
import PropTypes from "prop-types";
import {
  Home,
  LogOut,
  Menu,
  Users,
  MapPin,
  BarChart,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  PlusCircle,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Navigation configurations for different user types
const navigationConfig = {
  student: {
    mainNav: [
      { icon: <Home size={20} />, label: "Dashboard", path: "#" },
      {
        icon: <MessageSquare size={20} />,
        label: "Inbox",
        path: "#",
        showNotification: true,
      },
      {
        icon: <Bell size={20} />,
        label: "Notifications",
        path: "#",
        showNotification: true,
      },
      {
        icon: <Settings size={20} />,
        label: "Settings",
        path: "#",
      },
    ],
    bottomNav: [
      {
        icon: <HelpCircle size={20} />,
        label: "Help & Support",
        path: "#",
      },
      {
        icon: <LogOut size={20} />,
        label: "Log Out",
        path: "#",
        className: "text-red-400",
      },
    ],
    userRole: "User Account",
  },
  houseowner: {
    mainNav: [
      { icon: <Home size={20} />, label: "Dashboard", path: "/owner" },
      {
        icon: <PlusCircle size={20} />,
        label: "Add Listing",
        path: "#",
      },
      {
        icon: <MessageSquare size={20} />,
        label: "Inbox",
        path: "#",
        showNotification: true,
      },
      {
        icon: <BarChart size={20} />,
        label: "Analytics",
        path: "#",
      },
      {
        icon: <Settings size={20} />,
        label: "Settings",
        path: "#",
      },
    ],
    bottomNav: [
      {
        icon: <HelpCircle size={20} />,
        label: "Give Feedback",
        path: "#",
      },
      {
        icon: <HelpCircle size={20} />,
        label: "Help & Support",
        path: "#",
      },
      {
        icon: <LogOut size={20} />,
        label: "Log Out",
        path: "#",
        className: "text-red-400",
      },
    ],
    userRole: "Real Estate Builders",
  },
  admin: {
    mainNav: [
      { icon: <Home size={20} />, label: "Dashboard", path: "/admin" },
      {
        icon: <Users size={20} />,
        label: "Manage Users",
        path: "#",
      },
      {
        icon: <MapPin size={20} />,
        label: "Manage Listing",
        path: "#",
      },
      {
        icon: <BarChart size={20} />,
        label: "Analytics",
        path: "#",
      },
      {
        icon: <FileText size={20} />,
        label: "Reports/Content",
        path: "#",
      },
      {
        icon: <MessageSquare size={20} />,
        label: "All Feedbacks",
        path: "#",
      },
    ],
    bottomNav: [],
    userRole: "Admin",
  },
};

const DashboardLayout = ({
  children,
  userType,
  userName,
  currentPath,
  onNavigate,
  notificationCount = 0,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const config = navigationConfig[userType];

  const handleNavigation = (path) => {
    setIsSidebarOpen(false);
    onNavigate?.(path);
  };

  return (
    <div className="flex min-h-screen bg-[#1A1A1A]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 transform lg:translate-x-0 lg:relative lg:flex",
          "w-64 bg-[#1A1A1A] text-white transition-transform duration-200 ease-in-out z-30",
          "lg:h-screen flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* User Profile Section */}
        <div className="p-6 mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden">
              <img
                src="/api/placeholder/64/64"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className=" flex flex-col -space-y-2">
              <h3 className="font-medium text-lg">{userName}</h3>
              <p className="text-sm text-gray-400">{config.userRole}</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2">
          {config.mainNav.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              active={currentPath === item.path}
              onClick={() => handleNavigation(item.path)}
              notification={
                item.showNotification ? notificationCount : undefined
              }
            />
          ))}
        </nav>

        {/* Bottom Navigation */}
        {config.bottomNav.length > 0 && (
          <div className="p-2 border-t border-gray-800">
            {config.bottomNav.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                onClick={() => handleNavigation(item.path)}
                className={item.className}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#1A1A1A] text-white">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-800"
          >
            <Menu size={24} />
          </button>
          <span className="font-medium">{config.userRole} Dashboard</span>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white rounded-tl-[2rem] p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
  notification,
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors relative text-left",
        active && "bg-gray-800 text-white",
        className
      )}
    >
      {icon}
      <span>{label}</span>
      {notification && notification > 0 && (
        <span className="absolute right-3 bg-primaryBgColor text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notification}
        </span>
      )}
    </button>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  userType: PropTypes.oneOf(["student", "houseowner", "admin"]).isRequired,
  userName: PropTypes.string.isRequired,
  currentPath: PropTypes.string.isRequired,
  onNavigate: PropTypes.func,
  notificationCount: PropTypes.number,
};

NavItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  notification: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default DashboardLayout;
