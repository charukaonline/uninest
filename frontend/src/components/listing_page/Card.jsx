import React from "react";

const PropertyCard = ({ image, title, price, location }) => {
  return (
    <div className="w-72 border border-gray-200 rounded-lg overflow-hidden shadow-lg font-sans transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
      {/* Image Section */}
      <div className="relative">
        <img
          src={image} // Image from props
          alt={title} // Alt text from props
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Details Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-primaryBgColor font-bold text-lg mb-2">{price}</p>
        <p className="text-sm text-gray-600">{location}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
