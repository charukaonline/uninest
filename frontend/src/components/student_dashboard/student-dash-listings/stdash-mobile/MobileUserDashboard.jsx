import React, { useState } from "react";
import SearchFilters from "../../components/UserDashboardMobile/MobileSearchFilters.jsx";
import PropertyList from "../../components/UserDashboardMobile/MobilePropertyList.jsx";
import FeaturedProperty from "../../components/UserDashboardMobile/MobileFeaturedProperty.jsx";
import Sidebar from "../../components/UserDashboardMobile/MobileSideBar.jsx";
import ToggleSwitch from "../../components/listingpage/listing_page/ToggleSwitch"; // Ensure path is correct

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
