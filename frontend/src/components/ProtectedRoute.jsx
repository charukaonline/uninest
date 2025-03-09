import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useAuthStore } from '@/store/authStore';
import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from './include/LoadingSpinner';
import { useLandlordAuthStore } from '@/store/landlordAuthStore';
import NotFound from '@/pages/404Page';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    const { userId, email } = useParams();

    // Validate URL parameters
    const isValidUrl = () => {
        if (!userId || !email) return false;
        if (user && (user._id !== userId || user.email !== email)) return false;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (!isAuthenticated) {
        return <Navigate to="/auth/user-signin" />;
    }

    if (!isValidUrl()) {
        return <NotFound />;
    }

    return children;
};

export const LandlordProtectedRoute = ({ children }) => {
    const { isLandlordAuthenticated, landlord, checkLandlordAuth, isCheckingLandlordAuth } = useLandlordAuthStore();
    const { landlordId, email } = useParams();

    useEffect(() => {
        if (!isLandlordAuthenticated) {
            checkLandlordAuth();
        }
    }, []);

    if (isCheckingLandlordAuth) {
        return <LoadingSpinner />;
    }

    if (!isLandlordAuthenticated || !landlord?._id) {
        return <Navigate to="/auth/houseowner-signin" replace />;
    }

    const isValidUrl = () => {
        if (!landlord?._id || !landlord.email) return false;
        if (landlord && (landlord?._id !== landlordId || landlord.email !== email)) return false;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    if (!isValidUrl()) {
        return <NotFound />;
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