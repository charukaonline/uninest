import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useAuthStore } from '@/store/authStore';
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoadingSpinner from './include/LoadingSpinner';
import { useLandlordAuthStore } from '@/store/landlordAuthStore';

export function ProtectedRoute({ children }) {

    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user.isVerified) {
        return <Navigate to={"/"} replace />
    }

    return children;
};

export const LandlordProtectedRoute = ({ children }) => {
    const { isCheckingLandlordAuth, isLandlordAuthenticated, checkLandlordAuth } = useLandlordAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyLandlord = async () => {
            const isLandlordAuthenticated = await checkLandlordAuth();
            if (!isLandlordAuthenticated) {
                navigate('/auth/houseowner-signin');
            }
        };

        verifyLandlord();
    }, [checkLandlordAuth, navigate]);

    if (isCheckingLandlordAuth) {
        return <LoadingSpinner />;
    }

    if (!isLandlordAuthenticated) {
        return <Navigate to="/auth/uninest-admin" replace />;
    }

    return children;

};

export const AdminProtectedRoute = ({ children }) => {
    const { isCheckingAdminAuth, isAdminAuthenticated, checkAdminAuth } = useAdminAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            const isAuthenticated = await checkAdminAuth();
            if (!isAuthenticated) {
                navigate('/auth/uninest-admin');
            }
        };

        verifyAuth();
    }, [checkAdminAuth, navigate]);

    if (isCheckingAdminAuth) {
        return <LoadingSpinner />;
    }

    if (!isAdminAuthenticated) {
        return <Navigate to="/auth/uninest-admin" replace />;
    }

    return children;
};