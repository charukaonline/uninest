import StudentSidebar from '@/components/student_dashboard/StudentSidebar'
import React from 'react'

const Inbox = () => {
    return (
        <div className="flex h-screen bg-white">

            <div><StudentSidebar /></div>

            <div style={{ marginLeft: '220px', padding: '1rem' }}>
                <h1 className="text-2xl font-bold mb-4">
                    Inbox content goes here...
                </h1>
            </div>
        </div>
    )
}

export default Inbox