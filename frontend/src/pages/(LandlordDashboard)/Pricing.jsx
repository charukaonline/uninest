import Sidebar from '@/components/landlord_dashboard/Sidebar'
import React, { useState } from 'react'
import { IoPricetags } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa'

const Pricing = () => {
    const [currentPlan, setCurrentPlan] = useState('basic')

    // Monthly prices
    const prices = {
        basic: 10,
        premium: 25
    }

    return (
        <div className="flex h-full bg-gray-100 min-h-screen">
            <Sidebar className="fixed h-full" />

            <div className="flex-1 ml-[220px] p-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <IoPricetags className="mr-2 text-primaryBgColor" />
                        Pricing
                    </h1>
                    <p className="mb-6">Choose the plan that fits your needs. Get started today!</p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Plan */}
                    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${currentPlan === 'basic' ? 'border-primaryBgColor' : 'border-transparent'}`}>
                        {currentPlan === 'basic' && (
                            <div className="bg-primaryBgColor text-white text-center py-1 text-sm font-medium">
                                Current Plan
                            </div>
                        )}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Basic Plan</h3>
                            <p className="text-gray-600 mb-4">Perfect for landlords starting out</p>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold">Rs{prices.basic}</span>
                                <span className="text-gray-500 ml-2">/month</span>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>List up to 5 properties</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>Basic analytics</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>Email support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Premium Plan */}
                    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${currentPlan === 'premium' ? 'border-primaryBgColor' : 'border-transparent'}`}>
                        {currentPlan === 'premium' && (
                            <div className="bg-primaryBgColor text-white text-center py-1 text-sm font-medium">
                                Current Plan
                            </div>
                        )}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
                            <p className="text-gray-600 mb-4">For professional landlords</p>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold">Rs{prices.premium}</span>
                                <span className="text-gray-500 ml-2">/month</span>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>Unlimited properties</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>Advanced analytics</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>Priority support</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>Featured listings</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheck className="text-green-500 mr-2" />
                                    <span>Custom branding</span>
                                </div>
                            </div>
                            
                            <button 
                                className={`w-full py-2 rounded-md ${currentPlan === 'premium' ? 'bg-gray-200 text-gray-700' : 'bg-primaryBgColor text-white hover:bg-opacity-90 transition'}`}
                                disabled={currentPlan === 'premium'}
                            >
                                {currentPlan === 'premium' ? 'Current Plan' : 'Upgrade'}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Additional Information */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                    <p className="text-gray-600">Your next billing date is: <span className="font-medium">October 15, 2023</span></p>
                    <p className="text-gray-600 mt-2">Need help? <a href="#" className="text-primaryBgColor">Contact support</a></p>
                </div>
            </div>
        </div>
    )
}

export default Pricing