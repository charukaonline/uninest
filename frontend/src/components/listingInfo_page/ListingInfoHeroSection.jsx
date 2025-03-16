import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { IoMdPin } from "react-icons/io";
import { BiSolidConversation } from "react-icons/bi";
import { FaBookmark, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { MdRateReview, MdReport } from "react-icons/md";

import { Form, Input, Tooltip, Rate } from "antd";
import TextArea from 'antd/es/input/TextArea';
import StarRating from '../include/StarRating';
import { Button } from '../ui/button';
import { RatingDialog, ReportDialog } from './ListingActions';

const ListingInfoHeroSection = ({ listing }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    // Fetch reviews for this listing
    useEffect(() => {
        if (listing && listing._id) {
            fetchReviews();
        }
    }, [listing]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/review/listing-reviews/${listing._id}`);
            if (response.data.success) {
                const approvedReviews = response.data.reviews.filter(review => review.status === 'approved');
                setReviews(approvedReviews);
                
                // Calculate average rating
                if (approvedReviews.length > 0) {
                    const totalRating = approvedReviews.reduce((sum, review) => sum + review.ratings, 0);
                    setAverageRating(parseFloat((totalRating / approvedReviews.length).toFixed(1)));
                    setReviewCount(approvedReviews.length);
                }
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // Sample images array - replace with actual listing images when available
    const images = Array.isArray(listing.images) ? listing.images :
        [listing.images,
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1770&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1780&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1770&auto=format&fit=crop'];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto cycle through images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const selectImage = (index) => {
        setCurrentImageIndex(index);
    };

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
                        <div className="relative">
                            {/* Main image carousel */}
                            <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={`${listing.propertyName} - Image ${currentImageIndex + 1}`}
                                    className="h-full w-full object-cover transition-opacity duration-300"
                                />

                                {/* Navigation arrows */}
                                <div className="absolute inset-0 flex items-center justify-between p-4">
                                    <button
                                        onClick={prevImage}
                                        className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-75"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>

                                {/* Image counter */}
                                <div className="absolute bottom-4 right-4 rounded-full bg-black bg-opacity-50 px-2 py-1 text-white text-xs">
                                    {currentImageIndex + 1}/{images.length}
                                </div>
                            </div>

                            {/* Thumbnail preview */}
                            <div className="flex mt-2 space-x-2 overflow-x-auto py-1">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`h-16 w-24 flex-shrink-0 cursor-pointer rounded-md border-2 ${currentImageIndex === index ? 'border-primaryBgColor' : 'border-transparent'}`}
                                        onClick={() => selectImage(index)}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className=' p-4 rounded-lg w-1/3 bg-primaryBgColor'>

                        <div className=' mb-2'>
                            <div className=' flex space-x-3 items-center mt-2'>
                                <div className="rounded-full w-14 h-14 bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {listing.landlord.email ? listing.landlord.email.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className=' items-center -space-y-2'>
                                    <div className=' flex flex-row items-center -space-y-2 space-x-2'>
                                        <h1 className=' text-lg text-white'>{listing.landlord.username}</h1>
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
                            <StarRating rating={averageRating} /><h2 className=' text-white'>({averageRating}) {reviewCount > 0 ? `${reviewCount} reviews` : 'No reviews yet'}</h2>
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