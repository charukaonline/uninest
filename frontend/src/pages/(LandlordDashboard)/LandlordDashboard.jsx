import { useLandlordAuthStore } from '@/store/landlordAuthStore'
import React, { useEffect } from 'react'

const LandlordDashboard = () => {

    const {landlord, isLandlordAuthenticated, landlordLogout, isCheckingLandlordAuth, checkLandlordAuth} = useLandlordAuthStore();

    useEffect(() => {
        if (!isLandlordAuthenticated && !isCheckingLandlordAuth) {
            checkLandlordAuth();
        }
    }, [isLandlordAuthenticated, isCheckingLandlordAuth]);

    return (
        <div>LandlordDashboard</div>
    )
}

export default LandlordDashboard