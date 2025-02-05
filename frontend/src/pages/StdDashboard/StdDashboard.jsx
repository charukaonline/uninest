import DashboardLayout from "@/components/include/DashboardLayout";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = `${user.fullName}`;
  }, []);

  if (!user || user.id !== userId) {
    return <h1>Unauthorized Access</h1>;
  }

  return (
    <>
      <DashboardLayout
        userType="student"
        userName={user.fullName}
        currentPath={`/student/${userId}`}
        onNavigate={(path) => navigate(path)}
        messageCount={3}
        notificationCount={2}
      >
        {/* Student dashboard content */}
      </DashboardLayout>
    </>
  );
}
