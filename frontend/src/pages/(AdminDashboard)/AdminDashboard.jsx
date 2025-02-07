import DashboardLayout from "@/components/include/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Retrieve admin data from localStorage
    const storedAdmin = localStorage.getItem("adminData");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  useEffect(() => {
    if (admin) {
      document.title = `${admin.fullName}`;
    }
  }, [admin]);

  // **Show loading or unauthorized message while admin data is not yet available**
  if (!admin) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      userType="admin"
      userName={admin?.fullName}
      currentPath={`/admin/${admin?.adminId}`}
      onNavigate={(path) => navigate(path)}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Welcome Back, {admin?.fullName}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Add your stat cards here */}
        </div>

        {/* Other dashboard content */}
      </div>
    </DashboardLayout>
  );
}
