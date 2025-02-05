import useAuthStore from '@/store/authStore';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== null) {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
