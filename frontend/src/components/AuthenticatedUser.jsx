import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./include/LoadingSpinner";
import { useLandlordAuthStore } from "@/store/landlordAuthStore";

export function AuthenticatedUser({ children }) {
    const { isAuthenticated, user } = useAuthStore();
    const { isLandlordAuthenticated } = useLandlordAuthStore();

    // If authenticated as student, redirect to student dashboard
    if (isAuthenticated && user?.role === 'user') {
        return <Navigate to={`/student/${user._id}/${user.email}`} replace />;
    }

    // If authenticated as landlord, show login page
    if (isLandlordAuthenticated) {
        return children;
    }

    return children;
}

export function AuthenticatedLandlord({ children }) {
    const { isLandlordAuthenticated, landlord, checkLandlordAuth } = useLandlordAuthStore();

    useEffect(() => {
        if (!isLandlordAuthenticated) {
            checkLandlordAuth();
        }
    }, []);

    if (isLandlordAuthenticated && landlord?._id) {
        return <Navigate to={`/landlord/${landlord._id}/${landlord.email}`} replace />;
    }

    return children;
}

export function AuthenticatedAdmin({ children }) {
  const { isAdminAuthenticated, admin, isCheckingAdminAuth, checkAdminAuth } =
    useAdminAuthStore();
  const [authCheckComplete, setAuthCheckComplete] = React.useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAdminAuth();
      setAuthCheckComplete(true);
    };

    if (!authCheckComplete) {
      verifyAuth();
    }
  }, [checkAdminAuth, authCheckComplete]);

  if (isCheckingAdminAuth || !authCheckComplete) {
    return <LoadingSpinner />;
  }

  if (isAdminAuthenticated && admin?._id) {
    const redirectPath = `/admin/${admin._id}/${admin.email}`;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
