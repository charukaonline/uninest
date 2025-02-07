import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminId, email } = useParams();
  const { admin } = useAdminAuthStore();

  useEffect(() => {
    if (admin?.username) {
      document.title = `${admin.username}`;
    }
  }, [admin?.username]); // Add dependency

  if (!admin) {
    return <p>Loading...</p>; // Handle the case where admin data is not yet available
  }

  return (
    <div>
      <h1>Welcome Back, {admin.fullName}</h1>
      {/* Dashboard content */}
    </div>
  );
}
