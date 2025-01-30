import React, { useState } from "react";
import { MdFilterList } from "react-icons/md";
import SidePanel from "./SidePanel.jsx";

const ToggleButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Toggle Button with Icon */}
            <button
                onClick={togglePanel}
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition flex items-center justify-center"
            >
                <MdFilterList size={18} /> {/* Filter icon */}
            </button>

            {/* Side Panel */}
            <SidePanel isOpen={isOpen} togglePanel={togglePanel} />
        </div>
    );
};

export default ToggleButton;
