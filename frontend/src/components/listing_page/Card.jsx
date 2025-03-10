import React from "react";
import { IoMdPin } from "react-icons/io";
import { FaCalendarAlt, FaRulerCombined } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useListingStore from '@/store/listingStore';
import { Tooltip } from "antd";

const PropertyCard = ({ listing }) => {
  const { trackListingClick } = useListingStore();

  const handleClick = () => {
    trackListingClick(listing._id);
  };

  return (
    <Link
      key={listing._id}
      to={`/listing/${listing._id}`}
      onClick={handleClick}
    >
      <div className=" overflow-hidden p-4 border border-gray-200 bg-gray-100 rounded-lg shadow-lg transition transform hover:scale-105">
        <img
          src={listing.images[0]}
          alt={listing.propertyName}
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="p-4">
          <div className=" flex items-center justify-between">
            <h2 className="font-bold text-lg">{listing.propertyName}</h2>
            <p className="text-primaryBgColor text-[15px] font-bold mt-2">
              LKR {listing.monthlyRent.toLocaleString()}/month
            </p>
          </div>
          <div className=" flex items-center justify-between">
            <div className="flex items-center space-y-0 space-x-1">
              <IoMdPin className="text-gray-600" />
              <p className="text-gray-600 text-base truncate">{listing.address}</p>
            </div>

            <div className=" flex space-x-2 gap-2">
              <Tooltip title={`${listing.propertyType}`}>
                <FaHouseChimney className=" size-6 hover:text-primaryBgColor" />
              </Tooltip>
              <Tooltip title={`${listing.size} m²`}>
                <FaRulerCombined className=" size-6 hover:text-primaryBgColor" />
              </Tooltip>
              <Tooltip title={`Build in ${listing.builtYear}`}>
                <FaCalendarAlt className=" size-6 hover:text-primaryBgColor" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
