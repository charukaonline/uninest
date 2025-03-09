import React, { useState } from "react";
import SearchFilters from "./MobileSearchFilters.jsx";
import PropertyList from "./MobilePropertyList.jsx";
import FeaturedProperty from "./MobileFeaturedProperty.jsx";
import Sidebar from "./MobileSideBar.jsx";

const UserDashboardMobile = () => {
  const [mapView, setMapView] = useState(false); // Manage the map view state

  return (
    <div className="max-w-screen-xl mx-auto bg-gray-50 rounded-lg">


      {/* Search & Filters */}
      <SearchFilters />

      {/* Layout Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left - Listings & Featured Property */}
        <div className="col-span-12 space-y-6">
          <PropertyList />
          <FeaturedProperty />
        </div>

        {/* Right - Sidebar with Messages & Map */}
        <Sidebar />
      </div>
    </div>
  );
};

export default UserDashboardMobile;
