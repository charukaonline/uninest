import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user.isVerified) {
        return <Navigate to={"/"} replace />
    }

    return children;
};

export default ProtectedRoute;
