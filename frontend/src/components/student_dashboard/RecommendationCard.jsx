import React, { useState, useEffect } from 'react';
import { Tooltip, Tag, Button, notification } from 'antd';
import { IoMdPin } from 'react-icons/io';
import { MdArrowOutward } from 'react-icons/md';
import { FaBookmark } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useBookmarkStore } from '@/store/bookmarkStore';

const RecommendationCard = ({ listing, isBookmarked: initialIsBookmarked, showMatchScore = true }) => {
    const [loading, setLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked || false);

    const { isAuthenticated, user } = useAuthStore();
    const {
        addBookmark,
        removeBookmark,
        isListingBookmarked,
        bookmarks,
        fetchBookmarks
    } = useBookmarkStore();

    const actualListing = listing.listing || listing;
    const listingId = actualListing._id;
    const imageUrl = actualListing.images && actualListing.images[0
        ] ? actualListing.images[0] : "https://via.placeholder.com/300x200?text=No+Image";

    useEffect(() => {
        if (isAuthenticated && user?._id && !initialIsBookmarked) {
            setIsBookmarked(isListingBookmarked(listingId));
        }
    }, [isAuthenticated, user, listingId, isListingBookmarked, initialIsBookmarked]);

    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Price not available";
    };

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

    const toggleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            notification.info({
                message: 'Authentication Required',
                description: 'Please sign in to bookmark listings'
            });
            return;
        }

        setLoading(true);

        try {
            if (isBookmarked) {
                const bookmarkToRemove = bookmarks.find(
                    bookmark => bookmark.listing?._id === listingId || bookmark.listing === listingId
                );

                if (bookmarkToRemove) {
                    await removeBookmark(bookmarkToRemove._id, user._id);
                    setIsBookmarked(false);
                    notification.success({
                        message: 'Success',
                        description: 'Bookmark removed successfully'
                    });
                }
            } else {
                await addBookmark(listingId, user._id);
                setIsBookmarked(true);
                notification.success({
                    message: 'Success',
                    description: 'Bookmark added successfully'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: `Failed to ${isBookmarked ? 'remove' : 'add'} bookmark`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden p-4 border border-gray-200 bg-gray-100 rounded-lg shadow-lg transition transform hover:scale-105">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={actualListing?.propertyName || "Property listing"}
                    className="w-full h-48 object-cover rounded-md bg-purple-400"
                />

                <button
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                        isBookmarked ? "bg-yellow-500" : "bg-white/80"
                    } hover:bg-opacity-90 transition-colors`}
                    onClick={toggleBookmark}
                    disabled={loading}
                >
                    <FaBookmark
                        className={`text-${isBookmarked ? "white" : "gray-700"}`}
                        size={16}
                    />
                </button>
            </div>

            <div className="p-4">
                <h2 className="font-bold text-lg">{actualListing?.propertyName || "Property Title"}</h2>
                <p className="text-primaryBgColor text-[15px] font-bold mt-2">
                    LKR {formatPrice(actualListing?.monthlyRent)}/month
                </p>
                <div className="flex items-center justify-between">
                    <div className='flex items-center space-y-0 space-x-1'>
                        <IoMdPin className="text-gray-600" />
                        <p className="text-gray-600 text-base truncate">
                            {actualListing?.city || actualListing?.address || "Location not specified"}
                        </p>
                    </div>
                    <div>
                        <Tooltip title="View Listing">
                            <Link to={`/listing/${actualListing?._id || '#'}`}>
                                <div className="bg-primaryBgColor p-2 rounded-lg text-white hover:bg-green-600">
                                    <MdArrowOutward />
                                </div>
                            </Link>
                        </Tooltip>
                    </div>
                </div>

                {showMatchScore && formatScore(actualListing?.score) && (
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            Match: <Tag color={getMatchColor(actualListing.score)}>{formatScore(actualListing?.score)}</Tag>
                        </span>
                    </div>
                )}

                {actualListing?.matchReasons && actualListing.matchReasons.length > 0 && (
                    <div className="mt-2">
                        <ul className="text-xs text-gray-500">
                            {actualListing.matchReasons.map((reason, i) => (
                                <li key={i} className="list-disc ml-4">{reason}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationCard;