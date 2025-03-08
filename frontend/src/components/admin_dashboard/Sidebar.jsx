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
      path: `/admin/${adminId}/${email}`,
    },
    {
      icon: Users,
      label: "Manage Users",
      path: `/admin/${adminId}/${email}/users`,
    },
    {
      icon: Building2,
      label: "Manage Listings",
      path: `/admin/${adminId}/${email}/listings`,
    },
    {
      icon: Building2,
      label: "Add University",
      path: `/admin/${adminId}/${email}/add-university`,
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: `/admin/${adminId}/${email}/analytics`,
    },
    {
      icon: FileText,
      label: "Reports",
      path: `/admin/${adminId}/${email}/reports`,
    },
    {
      icon: MessageSquare,
      label: "Feedbacks",
      path: `/admin/${adminId}/${email}/feedbacks`,
    },
  ];

  return (
    <div className="h-screen w-64 bg-[#181818] border-r shadow-sm">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-white">UniNest Admin</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-[#eee] ${
              location.pathname === item.path
                ? "bg-[#030303] border-r-4 border-green-500"
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
