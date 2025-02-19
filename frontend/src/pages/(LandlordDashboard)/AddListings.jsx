import AddListingStep01 from '@/components/landlord_dashboard/AddListingStep01'
import AddListingStep02 from '@/components/landlord_dashboard/AddListingStep02';
import Sidebar from '@/components/landlord_dashboard/Sidebar'
import { notification } from 'antd';
import React, { useEffect, useState } from 'react'

const AddListings = () => {

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (step === 1) {
            document.title = 'Add Listing details'
        } else if (step === 2) {
            document.title = 'Add Location'
        }
    })

    const handleFirstStep = async (values) => {
        try {
            notification.success({
                message: 'First step completed',
                description: 'Please complete your listing details.',
            });
            setStep(2);
        } catch (error) {
            notification.error({
                message: "Add Listing details failed",
                description: error.response?.data?.message || 'Something went wrong'
            });
        }
    }

    const handleSecondStep = async (values) => {
        try {
            notification.success({
                message: 'Details added successfully',
                description: 'Your listing is now live.',
            })
        } catch (error) {
            notification.error({
                message: "Add Listing details failed",
                description: error.response?.data?.message || 'Something went wrong'
            });
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div><Sidebar /></div>

            <div style={{ marginLeft: '220px', marginTop: '-15px' }} className=' w-full'>
                {step === 1 && (
                    <AddListingStep01
                        onFinish={handleFirstStep}
                    />
                )}
                {step === 2 && (
                    <AddListingStep02
                        onFinish={handleSecondStep}
                    />
                )}
            </div>
        </div>
    )
}

export default AddListings