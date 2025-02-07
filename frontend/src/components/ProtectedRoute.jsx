import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {

    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user.isVerified) {
        return <Navigate to={"/"} replace />
    }

    return children;
};

export function AdminProtectedRoute({ children }) {
    const { isAdminAuthenticated, admin } = useAdminAuthStore();

    if (!isAdminAuthenticated || !admin) {
        return <Navigate to="/auth/uninest-admin" replace />;
    }

    return children;
}