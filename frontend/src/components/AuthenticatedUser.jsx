import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user?.isVerified) {
        const redirectPath = `/sd/${user._id}/${user.email}`;
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default AuthenticatedUser;
