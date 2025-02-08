import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/include/LoadingSpinner";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { adminId, email } = useParams();
    const { admin, isAdminAuthenticated, adminLogout, isCheckingAdminAuth } = useAdminAuthStore();

    const handleLogout = async () => {
        try {
            await adminLogout();
            navigate('/auth/uninest-admin');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        if (!isAdminAuthenticated && !isCheckingAdminAuth) {
            checkAdminAuth();
        }
    }, [isAdminAuthenticated, isCheckingAdminAuth, isCheckingAdminAuth]);

    useEffect(() => {
        if (admin?.username) {
            document.title = `${admin.username}'s Dashboard`;
        }
    }, [admin?.username]);

    if (isCheckingAdminAuth) {
        return <LoadingSpinner />;
    }

    if (!isAdminAuthenticated || !admin) {
        navigate('/auth/uninest-admin');
        return null;
    }

    return (
        <div>
            <h1>Welcome Back, {admin.username}</h1>
            <button onClick={handleLogout}>Logout</button>
            {/* Dashboard content */}
        </div>
    );
}
