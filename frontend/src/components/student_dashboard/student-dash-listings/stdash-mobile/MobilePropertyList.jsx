import React from "react";

const properties = [
  { name: "Meadow View", price: "$960.99", location: "Fremont, CA", image: "/UserDashboardimg/Image.png?url" },
  { name: "Greencares", price: "$999.89", location: "Golden, CO", image: "/UserDashboardimg/Image (1).png?url" },
  { name: "White Cottage", price: "$2989.99", location: "Arvada, CO", image: "/UserDashboardimg/Image (2).png?url" },
  { name: "The Stables", price: "$940.99", location: "Golden, CO", image: "/UserDashboardimg/Image (3).png?url" },
  { name: "The Old Rectory", price: "$998.99", location: "Arvada, CO", image: "/UserDashboardimg/Image (4).png?url" },
  { name: "Holly Cottage", price: "$2989.99", location: "Annapolis, MD", image: "/UserDashboardimg/Image.png?url" },
];

const PropertyList = () => {
  return (
      <div className="w-screen max-w-full h-[500px] overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {properties.map((listing, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <img
                    src={listing.image}
                    alt={`Image of ${listing.name}`}
                    className="rounded mb-4"
                />
                <h2 className="text-lg font-semibold">{listing.name}</h2>
                <p className="text-gray-600">{listing.location}</p>
                <p className="text-green-600 font-bold">{listing.price}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

export default PropertyList;
