import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { GoCheckCircleFill } from "react-icons/go";
import StarRating from '../include/StarRating';

const ListingInfo02 = ({ listing }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debugData, setDebugData] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            if (listing && listing._id) {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:5000/api/review/listing-reviews/${listing._id}`);
                    
                    if (response.data.success) {
                        // Only show approved reviews
                        const approvedReviews = response.data.reviews.filter(review => review.status === 'approved');
                        setReviews(approvedReviews);
                        
                        // Debug logging of first review
                        if (approvedReviews.length > 0) {
                            console.log('First review data:', approvedReviews[0]);
                            console.log('Student ID object:', approvedReviews[0].studentId);
                            console.log('Student email:', approvedReviews[0].studentId?.email);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchReviews();
    }, [listing]);

    // Get first letter of email as profile placeholder
    const getEmailInitial = (email) => {
        if (!email) return 'U'; // Default for unknown
        return email.charAt(0).toUpperCase();
    };

    // Try to get username first letter if email is not available
    const getInitial = (review) => {
        // Try email first
        if (review.studentId?.email) {
            return review.studentId.email.charAt(0).toUpperCase();
        }
        // Try username next
        else if (review.studentId?.username) {
            return review.studentId.username.charAt(0).toUpperCase();
        }
        // If all fails, try the user ID object directly
        else if (review.userId?.email) {
            return review.userId.email.charAt(0).toUpperCase();
        }
        // Default
        return 'U';
    };

    // Format date to relative time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMilliseconds = now - date;
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        } else {
            return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
        }
    };

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

            {/* Review for listing */}
            <div className="p-3 px-8 mt-8 bg-[#eee] rounded-lg mb-3">
                <h2 className="font-semibold text-lg">Reviews</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {loading ? (
                        <div className="col-span-3 text-center py-8">Loading reviews...</div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="p-5 bg-primaryBgColor rounded-xl shadow-lg flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-purple-500 shadow-sm">
                                        {getInitial(review)}
                                    </div>
                                    <div className="-space-y-1">
                                        <h2 className="text-lg font-semibold text-white">{review.studentId?.username || 'Anonymous'}</h2>
                                        <p className="text-sm text-gray-200">{formatDate(review.createdAt)}</p>
                                    </div>
                                </div>
                                <p className="text-base text-white leading-relaxed">
                                    {review.review}
                                </p>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={review.ratings} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8 text-gray-500">No reviews available for this listing.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListingInfo02