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
    return (
      <div
        style={{
          backgroundImage: 'url(/heroBackground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center'
        }}
        className=" flex flex-col"
      >
        <h1 className=" text-2xl text-black">Unauthorized</h1>
        <p className=" text-base text-black">You are not authorized to view this page.</p>
      </div>
    );
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
