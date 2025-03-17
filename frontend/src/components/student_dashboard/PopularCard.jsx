import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Tooltip } from "antd";
import { FaHouseChimney } from "react-icons/fa6";
import { FaBath, FaBed, FaCalendarAlt, FaRulerCombined, FaEye } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";
import { PiGarageFill } from "react-icons/pi";

import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import useListingStore from '@/store/listingStore';
import LoadingSpinner from '../include/LoadingSpinner';

const PopularCard = ({ limit = 1 }) => {
    const { popularListings, loading, fetchPopularListings } = useListingStore();

    useEffect(() => {
        fetchPopularListings(limit);
    }, [fetchPopularListings, limit]);

    if (loading && popularListings.length === 0) {
        return <LoadingSpinner />;
    }

    if (popularListings.length === 0) {
        return <p className="text-gray-500 text-center py-4">No popular listings found</p>;
    }

    return (
        <div className="space-y-6">
            {popularListings.map(listing => (
                <Card key={listing._id} className="bg-gray-100">
                    <CardHeader className="-mb-5">
                        <div className="flex space-x-2 justify-between mb-5">
                            <CardTitle>
                                {listing.propertyName}
                            </CardTitle>

                            <div>
                                <Tooltip title="View Listing">
                                    <Link to={`/listing/${listing._id}`}>
                                        <div className="bg-primaryBgColor p-2 rounded-lg text-white hover:bg-green-600">
                                            <MdArrowOutward />
                                        </div>
                                    </Link>
                                </Tooltip>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="gap-5 flex">
                            <div className="w-2/4">
                                <img
                                    src={listing.images[0] || "https://via.placeholder.com/150"}
                                    alt={listing.propertyName}
                                    className="w-full h-64 object-cover rounded-xl"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/150";
                                    }}
                                />
                                {/* View count badge */}
                                <div className="flex items-center space-x-1 mt-2 bg-gray-800 text-white px-2 py-1 rounded w-fit">
                                    <FaEye className="text-white" />
                                    <span>{listing.views || 0} views</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="-space-y-4 mb-4">
                                    <p className="font-semibold text-2xl">LKR {listing.monthlyRent?.toLocaleString()}/Month</p>
                                    <div className='flex items-center space-x-1 text-gray-500'>
                                        <h2><IoMdPin className="text-lg" /></h2>
                                        <h2 className="text-gray-600 leading-none">{listing.address}</h2>
                                    </div>
                                </div>

                                <hr className="border-2 rounded border-primaryBgColor" />

                                <div className="mt-4">
                                    <h2 className="text-lg text-gray-600 mb-4">Overview</h2>

                                    <div className="flex gap-5">
                                        <div>
                                            <div className="flex gap-4 mb-5">
                                                <FaHouseChimney className="p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                                <div className="-space-y-2">
                                                    <h2 className="text-sm text-gray-600">Type</h2>
                                                    <h2 className="font-semibold">{listing.propertyType}</h2>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <FaBed className="p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                                <div className="-space-y-2">
                                                    <h2 className="text-sm text-gray-600">Bedrooms</h2>
                                                    <h2 className="font-semibold">{listing.bedrooms || 'N/A'}</h2>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex gap-4 mb-5">
                                                <FaCalendarAlt className="p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                                <div className="-space-y-2">
                                                    <h2 className="text-sm text-gray-600">Build Year</h2>
                                                    <h2 className="font-semibold">{listing.builtYear}</h2>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <FaBath className="p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                                <div className="-space-y-2">
                                                    <h2 className="text-sm text-gray-600">Bathrooms</h2>
                                                    <h2 className="font-semibold">{listing.bathrooms || 'N/A'}</h2>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex gap-4 mb-5">
                                                <FaRulerCombined className="p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                                <div className="-space-y-2">
                                                    <h2 className="text-sm text-gray-600">Size (m²)</h2>
                                                    <h2 className="font-semibold">{listing.size || 'N/A'}</h2>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <PiGarageFill className="p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                                <div className="-space-y-2">
                                                    <h2 className="text-sm text-gray-600">Garages</h2>
                                                    <h2 className="font-semibold">{listing.garage || 'N/A'}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default PopularCard;