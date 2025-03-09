import React from "react";
import houseImage from "../../assets/HouseOwnerDashboard-img/Image.png";
import houseImage1 from "../../assets/HouseOwnerDashboard-img/Image (1).png";
import houseImage2 from "../../assets/HouseOwnerDashboard-img/Image (2).png";
import houseImage3 from "../../assets/HouseOwnerDashboard-img/Image (3).png";
import houseImage4 from "../../assets/HouseOwnerDashboard-img/Image (4).png";

const properties = [
  { name: "Meadow View", price: "$960.99", location: "Fremont, CA", image: houseImage },
  { name: "Greencares", price: "$999.89", location: "Golden, CO", image: houseImage1 },
  { name: "White Cottage", price: "$2989.99", location: "Arvada, CO", image: houseImage2 },
  { name: "The Stables", price: "$940.99", location: "Golden, CO", image: houseImage3 },
  { name: "The Old Rectory", price: "$998.99", location: "Arvada, CO", image: houseImage4 },
  { name: "Holly Cottage", price: "$2989.99", location: "Annapolis, MD", image: houseImage },
];

const PropertyList = () => {
  return (
    <div className="w-screen max-w-full h-[500px] overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((listing, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 justify-items-center">
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
