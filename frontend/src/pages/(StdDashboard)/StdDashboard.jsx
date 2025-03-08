
import LoadingSpinner from "@/components/include/LoadingSpinner";
import StudentSidebar from "@/components/student_dashboard/StudentSidebar";
import { useAuthStore } from "@/store/authStore";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentDashboard() {

  const { user, isAuthenticated, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, []);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  useEffect(() => {
    document.title = `${user?.username}'s dashboard`;
  }, []);

  return (
    <>
      <div className="flex h-screen bg-white">

        <div><StudentSidebar /></div>

        <div style={{ marginLeft: '220px', padding: '1rem' }}>
          <h1 className="text-2xl font-bold mb-4">
            Dashboard content goes here...
          </h1>
        </div>
      </div>
    </>
  );
}
