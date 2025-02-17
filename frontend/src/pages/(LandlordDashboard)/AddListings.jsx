import Sidebar from '@/components/landlord_dashboard/Sidebar'
import React from 'react'

const AddListings = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <div><Sidebar /></div>
            
            <div style={{ marginLeft: '220px', padding: '1rem' }}>
                <h1 className="text-2xl font-bold mb-4">
                    Add Listings content goes here...
                </h1>
            </div>
        </div>
    )
}

export default AddListings