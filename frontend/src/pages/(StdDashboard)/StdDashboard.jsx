import DashboardLayout from "@/components/include/DashboardLayout";
import StudentSidebar from "@/components/student_dashboard/StudentSidebar";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const { userId, email } = useParams();
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = `${user?.username}`;
  }, []);

  return (
    <>
      {/* <DashboardLayout
        userType="student"
        userName={user?.username}
        currentPath={"/"}
        onNavigate={(path) => navigate(path)}
        messageCount={3}
        notificationCount={2}
      > */}
      {/* Student dashboard content */}
      {/* </DashboardLayout> */}

      <StudentSidebar></StudentSidebar>

      <h1>Hello {user?.username}</h1>
    </>
  );
}
