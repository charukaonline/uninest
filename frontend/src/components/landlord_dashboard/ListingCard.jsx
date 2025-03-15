import React from 'react'
import { FaMapMarkerAlt, FaEye, FaHeart } from 'react-icons/fa';

const ListingCard = ({ listings }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(listing => (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="h-48 overflow-hidden relative">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-primaryBgColor text-white px-2 py-1 rounded text-sm font-medium">
                            {listing.price}
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="font-semibold text-lg mb-1">{listing.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 flex items-center">
                            <FaMapMarkerAlt className="mr-1 text-gray-500" /> {listing.location}
                        </p>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span className="flex items-center"><FaEye className="mr-1" /> {listing.views} views</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListingCard