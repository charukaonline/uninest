import React from "react";

const FeaturedProperty = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6">
      {/* Image at the top */}
      <img
        src="/src/assets/HouseOwnerDashboard-img/BG.png"
        alt="House"
        className="w-full h-64 object-cover rounded-lg"
      />

      {/* Price & Location */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">$32,000 / Year</h2>
          <p className="text-gray-500 text-lg">Doane Street, Fremont CA 94538</p>
        </div>
        {/* Bookmark Icon */}
        <button className="text-green-500 text-2xl">🔖</button>
      </div>

      {/* Overview (Icons + Text) */}
      <div className="grid grid-cols-2 gap-4 text-gray-700">
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
  );
};

export default FeaturedProperty;
