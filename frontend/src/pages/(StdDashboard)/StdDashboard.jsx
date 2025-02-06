import DashboardLayout from "@/components/include/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("adminData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      document.title = `${user.fullName}`;
    }
  }, [user]);

  if (!user) {
    return (
      <div
        style={{
          backgroundImage: "url(/heroBackground.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
        className="flex flex-col"
      >
        <h1 className="text-2xl text-black">Unauthorized</h1>
        <p className="text-base text-black">
          You are not authorized to view this page.
        </p>
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
