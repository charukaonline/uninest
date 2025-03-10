import React from 'react'

import { FaHouseChimney } from "react-icons/fa6";
import { FaBath, FaBed, FaCalendarAlt, FaRulerCombined } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";
import { PiGarageFill } from "react-icons/pi";

const ListingInfo01 = ({ listing }) => {
    return (
        <div className=' overflow-x-hidden px-12 w-full'>

            <div className=' p-3 px-8 mt-1 bg-[#eee] rounded-lg mb-3'>
                <h2 className=' font-semibold text-lg'>Overview</h2>

                <div className=' flex space-x-3 justify-between mt-6'>
                    <div className=' space-y-3'>
                        <h2>Property Type</h2>
                        <h2 className=' font-semibold text-lg'>{listing.propertyType}</h2>
                    </div>

                    <div className='space-y-4'>
                        <h2>Year Built</h2>
                        <div className='flex space-x-2 -space-y-1'>
                            <FaCalendarAlt className=' text-lg' />
                            <h2 className=' font-semibold text-lg'>{listing.builtYear}</h2>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h2>Size (m²)</h2>
                        <div className='flex space-x-2 -space-y-1'>
                            <FaRulerCombined className=' text-lg' />
                            <h2 className=' font-semibold text-lg'>{listing.size}</h2>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h2>Bedrooms</h2>
                        <div className='flex space-x-2 -space-y-1'>
                            <FaBed className=' text-xl' />
                            <h2 className=' font-semibold text-lg'>{listing.bedrooms}</h2>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h2>Bathrooms</h2>
                        <div className='flex space-x-2 -space-y-1'>
                            <FaBath className=' text-lg' />
                            <h2 className=' font-semibold text-lg'>{listing.bathrooms}</h2>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h2>Garage</h2>
                        <div className='flex space-x-2 -space-y-1'>
                            <PiGarageFill className=' text-xl' />
                            <h2 className=' font-semibold text-lg'>{listing.garage}</h2>
                        </div>
                    </div>
                </div>

            </div>

            <div className=' p-3 px-8 mt-8 bg-[#eee] rounded-lg'>
                <h2 className=' font-semibold text-lg'>Location</h2>

                <div className=' flex space-x-20 justify-between mt-6'>
                    <div className=' flex space-x-3 justify-between w-1/2 bg-white p-2 items-center rounded-lg'>
                        <h2 className=''>Address</h2>
                        <h2 className='font-semibold'>{listing.address}</h2>
                    </div>

                    <div className=' flex space-x-3 justify-between w-1/2 bg-white p-2 items-center rounded-lg'>
                        <h2 className=''>Zip/Postal Code</h2>
                        <h2 className='font-semibold'>{listing.postalCode}</h2>
                    </div>
                </div>

                <div className=' flex space-x-20 justify-between mt-2'>
                    <div className=' flex space-x-3 justify-between w-1/2 bg-white p-2 items-center rounded-lg'>
                        <h2 className=''>City</h2>
                        <h2 className='font-semibold'>{listing.city}</h2>
                    </div>

                    <div className=' flex space-x-3 justify-between w-1/2 bg-white p-2 items-center rounded-lg'>
                        <h2 className=''>University Proximity</h2>
                        <h2 className='font-semibold'>{listing.nearestUniversity}</h2>
                    </div>
                </div>

                <div className=' flex space-x-20 justify-between mt-2'>
                    <div className=' flex space-x-3 justify-between w-1/2 bg-white p-2 items-center rounded-lg'>
                        <h2 className=''>State/Province</h2>
                        <h2 className='font-semibold'>{listing.province}</h2>
                    </div>

                    <div className=' flex space-x-3 justify-between w-1/2 bg-white p-2 items-center rounded-lg'>
                        <h2 className=''>Country</h2>
                        <h2 className='font-semibold'>Sri Lanka</h2>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ListingInfo01