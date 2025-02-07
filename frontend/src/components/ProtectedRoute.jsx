import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("adminData");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Restore user from localStorage
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show loading while checking auth state
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
