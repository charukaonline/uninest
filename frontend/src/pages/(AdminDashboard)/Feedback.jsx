import Sidebar from '@/components/admin_dashboard/Sidebar'
import React from 'react'

const Feedback = () => {

  return (
    <div className="flex h-full bg-gray-100 min-h-screen">
      <div><Sidebar /></div>

      <div style={{ marginLeft: '230px' }} className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Feedbacks here</h1>
      </div>
    </div>
  )
}

export default Feedback