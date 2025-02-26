import React from "react";
import { IoMdPin } from "react-icons/io";
import { Link } from "react-router-dom";

const PropertyCard = ({ listing }) => {
  return (
    <Link
      key={listing._id}
      to={`/listing/${listing._id}`}
    >
      <div className=" overflow-hidden p-4 border border-gray-200 bg-gray-100 rounded-lg shadow-lg transition transform hover:scale-105">
        <img
          src={listing.images[0]}
          alt={listing.propertyName}
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="p-4">
          <h2 className="font-bold text-lg">{listing.propertyName}</h2>
          <p className="text-primaryBgColor text-[15px] font-bold mt-2">
            LKR {listing.monthlyRent.toLocaleString()}/month
          </p>
          <div className="flex items-center space-y-0 space-x-1">
            <IoMdPin className="text-gray-600" />
            <p className="text-gray-600 text-base truncate">{listing.address}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
