import DashboardLayout from "@/components/include/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    // Handle navigation using your router
    navigate(path);
  };

  return (
    <DashboardLayout
      userType="student"
      userName="Charuka"
      currentPath="/student"
      onNavigate={handleNavigate}
      messageCount={3}
      notificationCount={2}
    >
      {/* Student dashboard content */}
    </DashboardLayout>
  );
}
