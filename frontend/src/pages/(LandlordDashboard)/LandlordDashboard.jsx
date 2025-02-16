import { useLandlordAuthStore } from '@/store/landlordAuthStore'
import React from 'react'
import LoadingSpinner from '@/components/include/LoadingSpinner';

const LandlordDashboard = () => {
    const { landlord, isLandlordAuthenticated, isCheckingLandlordAuth } = useLandlordAuthStore();

    if (isCheckingLandlordAuth) {
        return <LoadingSpinner />;
    }

    if (!isLandlordAuthenticated || !landlord) {
        return null;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Welcome, {landlord?.firstName || landlord?.username || landlord?.email || 'Landlord'}
            </h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl mb-2">Your Profile</h2>
                <p>Email: {landlord.email}</p>
                <p>Status: {landlord.isVerified ? 'Verified' : 'Pending Verification'}</p>
            </div>
        </div>
    )
}

export default LandlordDashboard