import AddListingStep01 from '@/components/landlord_dashboard/AddListingStep01'
import AddListingStep02 from '@/components/landlord_dashboard/AddListingStep02';
import Sidebar from '@/components/landlord_dashboard/Sidebar'
import { notification } from 'antd';
import React, { useEffect, useState } from 'react'
import { addListing } from '@/store/listingStore';

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
            setFormData(values);
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
            const finalFormData = new FormData();
            const combinedData = { ...formData, ...values };

            // Debug
            console.log('Step 1 data:', formData);
            console.log('Step 2 data:', values);

            // Handle property images first
            if (formData.propertyImages) {
                const imageFiles = formData.propertyImages;
                imageFiles.forEach((file, index) => {
                    console.log(`Processing image ${index}:`, file);
                    finalFormData.append('propertyImages', file.originFileObj);
                });
            }

            // Handle all other fields
            Object.keys(combinedData).forEach(key => {
                if (key === 'coordinates') {
                    finalFormData.append('coordinates', JSON.stringify(combinedData[key]));
                } else if (key !== 'propertyImages') {  // Skip propertyImages as we handled it above
                    finalFormData.append(key, combinedData[key]);
                }
            });

            // Verify FormData contents
            console.log('Final FormData contents:');
            for (let [key, value] of finalFormData.entries()) {
                console.log(key, ':', value);
            }

            const response = await addListing(finalFormData);
            console.log('Server response:', response);
            
            notification.success({
                message: 'Listing added successfully',
                description: 'Your listing is now live.',
            });

            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Full error:', error);
            notification.error({
                message: "Add Listing failed",
                description: error.response?.data?.message || 'Failed to upload images. Please try again.',
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