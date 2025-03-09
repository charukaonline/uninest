import React, { useState } from "react";
import { Select, Button, Slider, Switch, Input, Drawer } from "antd";
import { FilterOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";

// Common styling for uniform height on the search box
const commonClasses = "h-12 flex items-center border border-gray-300 bg-white rounded-full px-4 shadow-sm";

// A simple SearchBox component
const SearchBox = () => (
  <div className={`${commonClasses} w-64`}>
    <Input
      placeholder="Search properties..."
      className="border-none focus:ring-0 flex-1 text-gray-700"
      allowClear
    />
    <SearchOutlined className="text-gray-500 ml-2 cursor-pointer" />
  </div>
);

const FilterBar = () => {
  // States for our filters
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [selectedBeds, setSelectedBeds] = useState(null);
  const [mapView, setMapView] = useState(false);

  // Example arrays for distance & beds
  const distances = [
    "Below 300m",
    "300m - 500m",
    "500m - 1km",
    "1km - 2km",
    "2km - 5km",
    "5km - 10km",
    "10km and above",
  ];
  const beds = ["1 Bed", "2 Beds", "3 Beds", "4+ Beds"];

  return (
    <div className="p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl font-semibold text-gray-900">249 Results</span>
      </div>

      {/* Single Filter Bar (Used for all screens) */}
      <div className="flex justify-between items-center">
        {/* Menu Button (opens drawer) */}
        <Button
          icon={<FilterOutlined />}
          onClick={() => setDrawerVisible(true)}
          className="bg-green-500 text-black hover:bg-green-600 transition"
        />
        {/* Search Box */}
        <SearchBox />
      </div>

      {/* The Drawer with the new content */}
      <Drawer
        title="Filters"
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="text-black"
      >
        {/* Universities */}
        <div className="mb-4">
          <span className="text-lg font-semibold">Universities</span>
          <Select placeholder="Select University" className="w-full mt-2" />
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <span className="text-lg font-semibold">Price Range</span>
          <p className="text-green-600">
            {`Price: $${priceRange[0]} - $${priceRange[1]}`}
          </p>
          <Slider
            range
            min={0}
            max={10000}
            value={priceRange}
            onChange={setPriceRange}
            className="mt-2"
          />
        </div>

        {/* Distance Filter */}
        <div className="mb-4">
          <span className="text-lg font-semibold">Distance</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {distances.map((distance) => (
              <Button
                key={distance}
                className={`w-full border ${
                  selectedDistance === distance
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setSelectedDistance(distance)}
              >
                {distance}
              </Button>
            ))}
          </div>
        </div>

        {/* Beds Filter */}
        <div className="mb-4">
          <span className="text-lg font-semibold">Beds</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {beds.map((bed) => (
              <Button
                key={bed}
                className={`w-full border ${
                  selectedBeds === bed
                    ? "bg-green-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setSelectedBeds(bed)}
              >
                {bed}
              </Button>
            ))}
          </div>
        </div>

        {/* Map View Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-bold mb-4 text-black">Map View</h2>
          <div className="h-64 bg-gray-300 flex items-center justify-center rounded">
            <p className="text-gray-700">Interactive Map Coming Soon</p>
          </div>
        </div>

        {/* Map View Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Map Toggle</span>
          <Switch checked={mapView} onChange={setMapView} />
        </div>

        {/* Apply Filters */}
        <Button
          className="w-full mt-4 bg-green-500 text-white hover:bg-green-600"
          onClick={() => setDrawerVisible(false)}
        >
          Apply Filters
        </Button>
      </Drawer>

      {/* Sorting Options (Recommended, Popular, Nearest) */}
      <div className="mt-4 flex gap-6 text-gray-600 font-medium">
        <span className="text-green-600 cursor-pointer">Recommended</span>
        <span className="cursor-pointer hover:text-green-500">Popular</span>
        <span className="cursor-pointer hover:text-green-500">Nearest</span>
      </div>
    </div>
  );
};

export default FilterBar;
