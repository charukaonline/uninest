import React from "react";

const FeaturedProperty = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex gap-6">
      {/* Left: Image Section */}
      <div className="w-1/3">
        <img
          src="/src/assets/HouseOwnerDashboard-img/BG.png"
          alt="House"
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      {/* Right: Info Section */}
      <div className="flex-1">
        {/* Price & Location */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">$32,000 / Year</h2>
            <p className="text-gray-500 text-lg">Doane Street, Fremont CA 94538</p>
          </div>
          {/* Bookmark Icon */}
          <button className="text-green-500 text-2xl">🔖</button>
        </div>

        <hr className="border-t-2 border-green-500 my-4 w-3/4" />

        {/* Overview Section */}
        <div className="grid grid-cols-3 gap-4 text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛏️</span>
            <p className="font-semibold">Bedroom: 4</p>
          </div>
          <div className="flex items-center gap-2 text-red-500">
            <span className="text-xl">🛁</span>
            <p className="font-semibold">Bath: 3</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📏</span>
            <p className="font-semibold">Sqft: 2200</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <p className="font-semibold">Type: Home</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <p className="font-semibold">Parking: Yes</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <p className="font-semibold">Build Year: 2020</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperty;