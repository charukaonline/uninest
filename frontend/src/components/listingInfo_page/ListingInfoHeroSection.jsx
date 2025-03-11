import React, { useState } from 'react'

import { IoMdPin } from "react-icons/io";
import { BiSolidConversation } from "react-icons/bi";
import { FaBookmark } from "react-icons/fa6";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { MdRateReview, MdReport } from "react-icons/md";

import { Form, Input, Tooltip, Rate } from "antd";
import TextArea from 'antd/es/input/TextArea';
import StarRating from '../include/StarRating';
import { Button } from '../ui/button';
import { RatingDialog, ReportDialog } from './ListingActions';

const ListingInfoHeroSection = ({ listing }) => {

    const averageRating = 4.5;

    return (
        <div className='overflow-x-hidden px-6 w-full'>
            <div className=' p-6 mt-3'>

                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-3'>
                        <h1 className='text-2xl font-semibold'>{listing.propertyName}</h1>
                        <div className='flex items-center space-x-1 text-gray-500'>
                            <h2><IoMdPin className="text-lg" /></h2>
                            <h2 className='text-base leading-none'>{listing.address}</h2>
                        </div>
                    </div>

                    <div>
                        <h2 className=' text-xl text-primaryBgColor'>
                            LKR {listing.monthlyRent.toLocaleString()}/month
                        </h2>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Tooltip title="The status of the listing">
                        <h2 className="bg-primaryBgColor text-white font-semibold uppercase text-sm p-2 rounded-lg cursor-pointer">
                            {listing.status} For Rent
                        </h2>
                    </Tooltip>

                    <Tooltip title="Sponsored Listing">
                        <h2 className="bg-[#90D4D6] text-black font-semibold uppercase text-sm p-2 rounded-lg cursor-pointer">
                            {listing.featured} Featured
                        </h2>
                    </Tooltip>
                </div>

                <div className=' flex space-x-2 mt-2'>
                    <div className=' items-center w-2/3'>
                        <img
                            src={listing.images}
                            alt={listing.propertyName}
                            className=' h-full w-full object-cover rounded-lg'
                        />
                    </div>
                    <div className=' p-4 rounded-lg w-1/3 bg-primaryBgColor'>

                        <div className=' mb-2'>
                            <div className=' flex space-x-3 items-center mt-2'>
                                <img src='/' alt='house owner' className=' rounded-full w-14 h-14 bg-purple-400' />
                                <div className=' items-center -space-y-2'>
                                    <div className=' flex flex-row items-center -space-y-2 space-x-2'>
                                        <h1 className=' text-lg text-white'>{listing.username} Sanoj Aminda</h1>
                                        <h1 className=' text-sm text-gray-300'>(House Owner)</h1>
                                    </div>
                                    <div>
                                        <h2 className=' text-gray-200'>Listed At: {new Date(listing.createdAt).toLocaleString()}</h2>
                                    </div>
                                </div>
                            </div>
                            {/* Needs to be dynamic */}
                            <h1 className=' mt-6 bg-white text-primaryBgColor font-semibold p-2 rounded-lg w-fit'>This boarding house is only for boys</h1>
                        </div>

                        <div className=' mt-6 flex items-center space-y-0 space-x-2'>
                            <StarRating rating={averageRating} /><h2 className=' text-white'>({averageRating})</h2>
                        </div>

                        <div className=' flex flex-col  h-fit rounded-lg p-2'>
                            <div className=' flex flex-col space-y-3 items-center mt-6'>
                                <Button className=" w-full bg-white text-black font-semibold hover:bg-gray-100">
                                    <BiSolidConversation className=' text-black' />Start Conversation
                                </Button>
                                <Button className=" w-full bg-white text-black font-semibold hover:bg-gray-100">
                                    <FaBookmark className=' text-black' />Add to Bookmark
                                </Button>
                                <Button className=" w-full bg-white text-black font-semibold hover:bg-gray-100">
                                    <RiCalendarScheduleFill className=' text-black' />Schedule a Visit
                                </Button>
                                <RatingDialog />
                                <ReportDialog />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingInfoHeroSection