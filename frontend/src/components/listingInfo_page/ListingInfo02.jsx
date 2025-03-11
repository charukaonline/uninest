import React from 'react'

import { GoCheckCircleFill } from "react-icons/go";

const ListingInfo02 = ({ listing }) => {
    return (
        <div className=' overflow-x-hidden px-12 w-full'>

            {/* Description */}
            <div className=' p-3 px-8 mt-8 bg-[#eee] rounded-lg mb-3'>
                <h2 className=' font-semibold text-lg'>Description</h2>

                <div className=' flex space-x-3 justify-between mt-6'>
                    <div className='space-y-4'>
                        <h2 className=''>{listing.description}</h2>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className=' p-3 px-8 mt-8 bg-[#eee] rounded-lg mb-3'>
                <h2 className=' font-semibold text-lg'>Features</h2>

                <div className=' flex flex-col space-x-3 justify-between mt-6'>
                    <div className=' flex space-x-56 mb-2'>
                        <div className=' flex space-x-3 items-center justify-center'>
                            <GoCheckCircleFill className=' text-primaryBgColor text-2xl' />
                            <h2 className=' my-auto'>Air Conditioning</h2>
                        </div>

                        <div className=' flex space-x-3 items-center justify-center'>
                            <GoCheckCircleFill className=' text-primaryBgColor text-2xl' />
                            <h2 className=' my-auto'>Washer</h2>
                        </div>

                        <div className=' flex space-x-3 items-center justify-center'>
                            <GoCheckCircleFill className=' text-primaryBgColor text-2xl' />
                            <h2 className=' my-auto'>Laundry</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map view */}

            {/* Feedbacks for listing */}
            <div className="p-3 px-8 mt-8 bg-[#eee] rounded-lg mb-3">
                <h2 className="font-semibold text-lg">Feedbacks</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {/* Feedback 1 */}
                    <div className="p-5 bg-primaryBgColor rounded-xl shadow-lg flex flex-col gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <img
                                src="https://randomuser.me/api/portraits/men/10.jpg"
                                alt="User"
                                className="w-14 h-14 rounded-full border-2 border-purple-500 shadow-sm"
                            />
                            <div className="-space-y-1">
                                <h2 className="text-lg font-semibold text-white">John Doe</h2>
                                <p className="text-sm text-gray-200">3 hours ago</p>
                            </div>
                        </div>
                        {/* Review Text */}
                        <p className="text-base text-white leading-relaxed">
                            Great place to stay! The environment was clean and peaceful.
                        </p>
                    </div>

                    {/* Feedback 2 */}
                    <div className="p-5 bg-primaryBgColor rounded-xl shadow-lg flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://randomuser.me/api/portraits/women/12.jpg"
                                alt="User"
                                className="w-14 h-14 rounded-full border-2 border-purple-500 shadow-sm"
                            />
                            <div className="-space-y-1">
                                <h2 className="text-lg font-semibold text-white">Jane Smith</h2>
                                <p className="text-sm text-gray-200">5 hours ago</p>
                            </div>
                        </div>
                        <p className="text-base text-white leading-relaxed">
                            Loved the atmosphere! Definitely recommend.
                        </p>
                    </div>

                    {/* Feedback 3 */}
                    <div className="p-5 bg-primaryBgColor rounded-xl shadow-lg flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://randomuser.me/api/portraits/men/15.jpg"
                                alt="User"
                                className="w-14 h-14 rounded-full border-2 border-purple-500 shadow-sm"
                            />
                            <div className="-space-y-1">
                                <h2 className="text-lg font-semibold text-white">Mark Wilson</h2>
                                <p className="text-sm text-gray-200">1 day ago</p>
                            </div>
                        </div>
                        <p className="text-base text-white leading-relaxed">
                            The place was neat and well-maintained. Would visit again.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ListingInfo02