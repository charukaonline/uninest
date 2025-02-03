import React, { useState } from "react";
import { Select, Button } from "antd";
import ToggleSwitch from "./ToggleSwitch";
import PriceRange from "./PriceRange";

const universities = [
    "University of Colombo",
    "University of Peradeniya",
    "University of Moratuwa",
    "University of Sri Jayewardenepura",
    "University of Kelaniya",
    "Rajarata University",
    "Sabaragamuwa University",
    "Wayamba University",
    "Uva Wellassa University",
    "South Eastern University",
    "University of Jaffna",
    "University of Ruhuna",
    "Open University of Sri Lanka",
    "SLIIT",
    "NSBM Green University",
    "CINEC Campus",
    "APIIT Sri Lanka",
    "SAITM",
];

const distanceOptions = [
    { value: "<300m", label: "Below 300m" },
    { value: "300-500m", label: "300m - 500m" },
    { value: "500m-1km", label: "500m - 1km" },
    { value: "1-2km", label: "1km - 2km" },
    { value: "2-5km", label: "2km - 5km" },
    { value: "5-10km", label: "5km - 10km" },
    { value: ">10km", label: "10km and above" },
];

const bedOptions = [
    { value: "1", label: "1 Bed" },
    { value: "2", label: "2 Beds" },
    { value: "3", label: "3 Beds" },
    { value: "4+", label: "4+ Beds" },
];

const SidePanel = ({ isOpen, togglePanel }) => {
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedDistance, setSelectedDistance] = useState(null);
    const [selectedBeds, setSelectedBeds] = useState(null);
    const [mapView, setMapView] = useState(false);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={togglePanel} // Clicking outside closes the panel
        >
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-72 p-6 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                onClick={(e) => e.stopPropagation()} // Prevent click inside panel from closing it
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                        onClick={togglePanel}
                        className="text-white hover:text-gray-300 text-xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Universities Dropdown */}
                <h2 className="text-sm font-semibold mt-8 mb-3">Universities</h2>
                <Select
                    placeholder="Select University"
                    value={selectedUniversity}
                    onChange={setSelectedUniversity}
                    className="w-full"
                    options={universities.map((uni) => ({ value: uni, label: uni }))}
                />

                {/* Price Range Filter */}
                <h2 className="text-sm font-semibold mt-6 mb-3">Price Range</h2>
                <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />

                {/* Distance Filter (Button Grid) */}
                <h2 className="text-sm font-semibold mt-6 mb-3">Distance</h2>
                <div className="grid grid-cols-2 gap-2">
                    {distanceOptions.map((option) => (
                        <Button
                            key={option.value}
                            type={selectedDistance === option.value ? "primary" : "default"}
                            className="w-full text-white bg-gray-700 hover:bg-green-500"
                            onClick={() => setSelectedDistance(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>

                {/* Beds Selection (Button Grid) */}
                <h2 className="text-sm font-semibold mt-6 mb-3">Beds</h2>
                <div className="grid grid-cols-2 gap-2">
                    {bedOptions.map((option) => (
                        <Button
                            key={option.value}
                            type={selectedBeds === option.value ? "primary" : "default"}
                            className="w-full text-white bg-gray-700 hover:bg-green-500"
                            onClick={() => setSelectedBeds(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>

                {/* Map View Toggle */}
                <h2 className="text-sm font-semibold mt-6 mb-2">Map View</h2>
                <ToggleSwitch label="Enable Map View" checked={mapView} onChange={setMapView} />
            </div>
        </div>
    );
};

export default SidePanel;
