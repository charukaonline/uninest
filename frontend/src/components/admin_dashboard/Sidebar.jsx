import { Link, useLocation, useParams } from "react-router-dom";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const { adminId, email } = useParams();
  const { admin } = useAdminAuthStore();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: `/ad/${adminId}/${email}`,
    },
    {
      icon: Users,
      label: "Manage Users",
      path: `/admin/users/${adminId}/${email}`,
    },
    {
      icon: Building2,
      label: "Manage Listings",
      path: `/admin/listings/${adminId}/${email}`,
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: `/admin/analytics/${adminId}/${email}`,
    },
    {
      icon: FileText,
      label: "Reports",
      path: `/admin/reports/${adminId}/${email}`,
    },
    {
      icon: MessageSquare,
      label: "Feedbacks",
      path: `/admin/feedbacks/${adminId}/${email}`,
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">UniNest Admin</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              location.pathname === item.path
                ? "bg-gray-100 border-l-4 border-blue-500"
                : ""
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
