import { Tooltip, Tag } from 'antd'
import React from 'react'
import { IoMdPin } from 'react-icons/io'
import { MdArrowOutward } from 'react-icons/md'
import { Link } from 'react-router-dom'

const RecommendationCard = ({ listing }) => {
    // Use the first image from listing or placeholder if none provided
    const imageUrl = listing?.images && listing?.images.length > 0 
        ? listing.images[0] 
        : "https://via.placeholder.com/150";
    
    // Format price with commas for thousands
    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Price not available";
    };

    // Format score as percentage
    const formatScore = (score) => {
        if (score === undefined || score === null) return null;
        return `${Math.round(score * 100)}%`;
    };

    const getMatchColor = (score) => {
        if (!score) return '';
        const scoreNum = parseFloat(score);
        if (scoreNum >= 0.8) return 'green';
        if (scoreNum >= 0.6) return 'cyan';
        if (scoreNum >= 0.4) return 'blue';
        return 'default';
    };

    return (
        <div className="overflow-hidden p-4 border border-gray-200 bg-gray-100 rounded-lg shadow-lg transition transform hover:scale-105">
            <img
                src={imageUrl}
                alt={listing?.propertyName || "Property listing"}
                className="w-full h-48 object-cover rounded-md bg-purple-400"
            />
            <div className="p-4">
                <h2 className="font-bold text-lg">{listing?.propertyName || "Property Title"}</h2>
                <p className="text-primaryBgColor text-[15px] font-bold mt-2">
                    LKR {formatPrice(listing?.monthlyRent)}/month
                </p>
                <div className="flex items-center justify-between">
                    <div className='flex items-center space-y-0 space-x-1'>
                        <IoMdPin className="text-gray-600" />
                        <p className="text-gray-600 text-base truncate">
                            {listing?.city || listing?.address || "Location not specified"}
                        </p>
                    </div>
                    <div>
                        <Tooltip title="View Listing">
                            <Link to={`/listing/${listing?._id || '#'}`}>
                                <div className="bg-primaryBgColor p-2 rounded-lg text-white hover:bg-green-600">
                                    <MdArrowOutward />
                                </div>
                            </Link>
                        </Tooltip>
                    </div>
                </div>
                
                {formatScore(listing?.score) && (
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            Match: <Tag color={getMatchColor(listing.score)}>{formatScore(listing?.score)}</Tag>
                        </span>
                    </div>
                )}
                
                {listing?.matchReasons && listing.matchReasons.length > 0 && (
                    <div className="mt-2">
                        <ul className="text-xs text-gray-500">
                            {listing.matchReasons.map((reason, i) => (
                                <li key={i} className="list-disc ml-4">{reason}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecommendationCard