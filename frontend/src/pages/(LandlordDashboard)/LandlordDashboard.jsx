import { useLandlordAuthStore } from '@/store/landlordAuthStore'
import React, { useEffect } from 'react'
import LoadingSpinner from '@/components/include/LoadingSpinner';
import Sidebar from '@/components/landlord_dashboard/Sidebar';

const LandlordDashboard = () => {
    const { landlord, isLandlordAuthenticated, checkLandlordAuth, isCheckingLandlordAuth } = useLandlordAuthStore();

    useEffect(() => {
        if (!isLandlordAuthenticated) {
            checkLandlordAuth();
        }
    }, []);

    if (isCheckingLandlordAuth) {
        return <LoadingSpinner />;
    }

    if (!isLandlordAuthenticated || !landlord) {
        return null;
    }

    useEffect(() => {
        document.title = `${landlord.username}'s Dashboard`;
    })

    return (
        <div className="flex h-screen bg-gray-100">

            <div><Sidebar /></div>

            <div style={{ marginLeft: '220px', padding: '1rem' }}>
                <h1 className="text-2xl font-bold mb-4">
                    Dashboard content goes here...
                </h1>
            </div>
        </div>
    )
}

export default LandlordDashboard