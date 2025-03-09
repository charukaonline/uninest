import React, { useState } from "react";
import { Row, Col, Input, Slider, Select, Switch, Button, Popover, Typography } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const FilterBar = () => {
    const [mapView, setMapView] = useState(false);
    const [priceRange, setPriceRange] = useState([500, 2000]);
    const [selectedBeds, setSelectedBeds] = useState("2-4 Beds");
    const [selectedPropertyType, setSelectedPropertyType] = useState("apartment");

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const filterContent = (
        <div className="p-4">
            <Text strong className="text-green-600">Property Type:</Text>
            <Select
                value={selectedPropertyType}
                onChange={(value) => setSelectedPropertyType(value)}
                className="green-select w-full mt-2 rounded-lg"
            >
                <Option value="apartment">Apartment</Option>
                <Option value="house">House</Option>
                <Option value="condo">Condo</Option>
            </Select>
        </div>
    );

    return (
        <div className="p-6 w-full">
            <style jsx>{`
                .green-input {
                    border: 1px solid #52c41a !important;
                }
                .green-input:hover,
                .green-input:focus {
                    border-color: #52c41a !important;
                    box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2) !important;
                }

                .green-select .ant-select-selector {
                    border: 1px solid #52c41a !important;
                    border-radius: 0.5rem !important;
                }
                .green-select .ant-select-selector:hover,
                .green-select .ant-select-focused .ant-select-selector {
                    border-color: #52c41a !important;
                    box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2) !important;
                }

                .green-slider .ant-slider-track {
                    background-color: #52c41a !important;
                }

                .green-button {
                    background-color: #52c41a !important;
                    border-color: #52c41a !important;
                }
                .green-button:hover,
                .green-button:focus {
                    background-color: #3d8b1d !important;
                    border-color: #3d8b1d !important;
                    box-shadow: 0 0 0 2px rgba(61, 139, 29, 0.2) !important;
                }
            `}</style>
            {/* Header Section */}
            <Row justify="space-between" align="middle" className="mb-6">
                <Col>
                    <Title level={4} className="text-green-700">249 Results</Title>
                </Col>
                <Col>
                    <Switch checked={mapView} onChange={setMapView} />
                    <span className="ml-2 text-green-600">Map View</span>
                </Col>
            </Row>

            {/* Filters & Search */}
            <Row gutter={[16, 16]} align="middle">
                {/* Search Box */}
                <Col flex="auto">
                    <Input
                        placeholder="Search properties..."
                        suffix={<SearchOutlined />}
                        className="green-input w-full rounded-lg"
                        allowClear
                    />
                </Col>

                {/* Price Range */}
                <Col flex="auto">
                    <div className="flex items-center w-full">
                        <Text strong className="mr-2 text-green-600">
                            Price:
                        </Text>
                        <Slider
                            range
                            min={0}
                            max={5000}
                            value={priceRange}
                            onChange={handlePriceChange}
                            step={10}
                            className="green-slider flex-grow"
                        />
                        <Text className="ml-2 text-green-600">{`$${priceRange[0]} - $${priceRange[1]}`}</Text>
                    </div>
                </Col>

                {/* Bed Selector */}
                <Col flex="auto">
                    <Select
                        value={selectedBeds}
                        onChange={(value) => setSelectedBeds(value)}
                        className="green-select w-full rounded-lg"
                    >
                        <Option value="1-2 Beds">1-2 Beds</Option>
                        <Option value="2-4 Beds">2-4 Beds</Option>
                        <Option value="4+ Beds">4+ Beds</Option>
                    </Select>
                </Col>

                {/* Property Type Selector */}
                <Col flex="auto">
                    <Select
                        value={selectedPropertyType}
                        onChange={(value) => setSelectedPropertyType(value)}
                        className="green-select w-full rounded-lg"
                    >
                        <Option value="apartment">Apartment</Option>
                        <Option value="house">House</Option>
                        <Option value="condo">Condo</Option>
                    </Select>
                </Col>

                {/* Filters Popover Button */}
                <Col>
                    <Popover content={filterContent} title="Filters" trigger="click">
                        <Button
                            icon={<FilterOutlined />}
                            type="primary"
                            className="green-button"
                        >
                            Filters
                        </Button>
                    </Popover>
                </Col>
            </Row>

            {/* Sorting Options */}
            <Row justify="start" className="mt-6">
                <Col>
                    <Button type="link" className="text-green-600 hover:text-green-700 focus:text-green-700">
                        Recommended
                    </Button>
                    <Button type="link" className="text-green-600 hover:text-green-700 focus:text-green-700">
                        Popular
                    </Button>
                    <Button type="link" className="text-green-600 hover:text-green-700 focus:text-green-700">
                        Nearest
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default FilterBar;
