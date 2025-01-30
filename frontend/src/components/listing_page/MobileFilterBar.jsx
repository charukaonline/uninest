import React, { useState } from "react";
import { Button, Input } from "antd"; 
import { SearchOutlined } from "@ant-design/icons";
import ToggleButton from "./ToggleButton.jsx";

const SearchBarWithFilter = ({ onSearch, onFilterClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
      {/* Search Input */}
      <Input
        placeholder="Search..."
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={handleSearch}
        className="flex-1"
      />
      
      {/* Filter Button */}
      <ToggleButton/>
    </div>
  );
};

export default SearchBarWithFilter;
