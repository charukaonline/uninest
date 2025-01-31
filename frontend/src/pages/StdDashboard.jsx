import PropTypes from "prop-types";
import { Home, Inbox, Bell, Settings, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
              <img
                src="/api/placeholder/48/48"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">User Name</h3>
              <p className="text-sm text-gray-400">Real Estate Builder</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          <NavItem icon={<Home size={20} />} label="Dashboard" active />
          <NavItem icon={<Inbox size={20} />} label="Inbox" notification={3} />
          <NavItem
            icon={<Bell size={20} />}
            label="Notifications"
            notification={2}
          />
          <NavItem icon={<Settings size={20} />} label="Settings" />

          {/* Bottom Section */}
          <div className="absolute bottom-0 w-64 border-t border-gray-800">
            <NavItem icon={<HelpCircle size={20} />} label="Help & Support" />
            <NavItem
              icon={<LogOut size={20} />}
              label="Log Out"
              className="text-red-400"
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, label, active = false, notification, className }) => {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors relative",
        active && "bg-gray-800 text-white",
        className
      )}
    >
      {icon}
      <span>{label}</span>
      {notification && (
        <span className="absolute right-6 bg-green-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notification}
        </span>
      )}
    </a>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

NavItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  notification: PropTypes.number,
  className: PropTypes.string,
};

export default DashboardLayout;
