import { useState } from "react";
import { Select, Popover, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import SearchBox from "./SearchBox";
import ToggleSwitch from "./ToggleSwitch";
import PriceRange from "./PriceRange";
import BedSelector from "./BedSelector";

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

const FilterBar = () => {
    const [mapView, setMapView] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedBeds, setSelectedBeds] = useState("2-4 Beds");
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedDistance, setSelectedDistance] = useState(null);

    // Popover content for Filters
    const filterContent = (
        <div className="w-56 p-2">
            <h4 className="font-semibold text-gray-700">Distance Filter</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {distanceOptions.map((option) => (
                    <Button
                        key={option.value}
                        type={selectedDistance === option.value ? "primary" : "default"}
                        className="w-full text-gray-700"
                        onClick={() => setSelectedDistance(option.value)}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-wrap items-center justify-between bg-white shadow-md p-3 rounded-lg border">
            <span className="text-lg font-semibold">249 Results</span>

            <div className="flex flex-wrap gap-3 items-center flex-1 justify-center">
                <SearchBox />
                <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />
                <BedSelector selectedBeds={selectedBeds} setSelectedBeds={setSelectedBeds} />

                {/* University Dropdown */}
                <Select
                    placeholder="Select University"
                    value={selectedUniversity}
                    onChange={setSelectedUniversity}
                    className="w-48"
                    options={universities.map((uni) => ({ value: uni, label: uni }))}
                />

                {/* Filters Button with Popover */}
                <Popover content={filterContent} title="Filters" trigger="click">
                    <Button icon={<FilterOutlined />} className="flex items-center">
                        Filters ≡
                    </Button>
                </Popover>
            </div>

            <ToggleSwitch label="Map View" checked={mapView} onChange={setMapView} />
        </div>
    );
};

export default FilterBar;
