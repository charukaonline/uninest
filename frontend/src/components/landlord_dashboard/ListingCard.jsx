import React from 'react'
import { FaMapMarkerAlt, FaEye, FaBed, FaBath, FaRulerCombined, FaHeart } from 'react-icons/fa';

const ListingCard = ({ listings }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="h-52 overflow-hidden relative group">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                        
                        <div className="absolute bottom-2 right-2 bg-primaryBgColor text-white px-3 py-1.5 rounded-md text-base font-semibold shadow-sm">
                            {listing.price}
                        </div>
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-xl mb-2 text-gray-800 hover:text-primaryBgColor transition">{listing.title}</h3>
                        <p className="text-gray-600 mb-3 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-primaryBgColor" /> {listing.location}
                        </p>
                        
                        {/* Property features */}
                        <div className="flex justify-between pb-3 mb-3 border-b border-gray-200">
                            <div className="flex items-center text-gray-700">
                                <FaBed className="mr-1.5 text-primaryBgColor" />
                                <span>{listing.bedrooms || '2'} beds</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaBath className="mr-1.5 text-primaryBgColor" />
                                <span>{listing.bathrooms || '1'} bath</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <FaRulerCombined className="mr-1.5 text-primaryBgColor" />
                                <span>{listing.size || '800'} sqft</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="flex items-center text-gray-500">
                                <FaEye className="mr-1.5 text-gray-500" /> {listing.views} views
                            </span>
                            <button className="bg-primaryBgColor hover:bg-primaryBgColor/90 text-white px-3 py-1.5 rounded font-medium transition">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListingCard