import { useState } from "react";
import { Dropdown, Button, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

const BedSelector = ({ selectedBeds, setSelectedBeds }) => {
    const bedOptions = ["1 Bed", "2 Beds", "3 Beds", "4+ Beds"];

    const handleMenuClick = (e) => {
        setSelectedBeds(e.key);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            {bedOptions.map((bed) => (
                <Menu.Item key={bed} style={{ backgroundColor: selectedBeds === bed ? "#4CAF50" : "white", color: selectedBeds === bed ? "white" : "#333" }}>
                    {bed}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={["click"]}>
            <Button
                style={{
                    borderColor: "#4CAF50",
                    color: "#4CAF50",
                    backgroundColor: "white",
                }}
                className="hover:bg-green-600 hover:text-white transition-all duration-200"
            >
                {selectedBeds} <DownOutlined />
            </Button>
        </Dropdown>
    );
};

export default BedSelector;
