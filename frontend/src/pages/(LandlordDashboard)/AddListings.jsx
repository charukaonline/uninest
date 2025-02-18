import AddListingStep01 from '@/components/landlord_dashboard/AddListingStep01'
import Sidebar from '@/components/landlord_dashboard/Sidebar'
import React, { useEffect } from 'react'

const AddListings = () => {

    useEffect(() => {
        document.title = 'Add Listing details'
    })

    return (
        <div className="flex h-screen bg-gray-100">
            <div><Sidebar /></div>

            <div style={{ marginLeft: '220px', marginTop: '-15px' }} className=' w-full'>
                <AddListingStep01 />
            </div>
        </div>
    )
}

export default AddListings