import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useAuthStore } from '@/store/authStore';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './include/LoadingSpinner';

export function AuthenticatedUser({ children }) {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user?.isVerified) {
        const redirectPath = `/sd/${user._id}/${user.email}`;
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export function AuthenticatedAdmin({ children }) {
    const { isAdminAuthenticated, admin, isCheckingAdminAuth, checkAdminAuth } = useAdminAuthStore();
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
        const redirectPath = `/ad/${admin._id}/${admin.email}`;
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}
