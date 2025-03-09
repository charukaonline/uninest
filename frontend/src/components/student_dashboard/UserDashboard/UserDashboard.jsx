import React, { useState } from "react";
import { motion } from "framer-motion";
import SearchFilters from "../../components/UserDashboard/SearchFilters.jsx";
import PropertyList from "../../components/UserDashboard/PropertyList.jsx";
import FeaturedProperty from "../../components/UserDashboard/FeaturedProperty.jsx";
import Sidebar from "../../components/UserDashboard/Sidebar.jsx";
import ToggleSwitch from "../../components/listingpage/listing_page/ToggleSwitch"; // Ensure path is correct

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, ease: "easeInOut" } },
};

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const UserDashboardListingDesktop = () => {
    const [mapView, setMapView] = useState(false); // Manage the map view state

    return (
        <motion.div
            className="max-w-screen-xl mx-auto bg-gray-50 rounded-lg p-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Search & Filters */}
            <motion.div variants={sectionVariants}>
                <SearchFilters />
            </motion.div>

            {/* Layout Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left - Listings & Featured Property */}
                <div className="col-span-8 space-y-6">
                    <motion.div variants={sectionVariants}>
                        <PropertyList />
                    </motion.div>
                    <motion.div variants={sectionVariants}>
                        <FeaturedProperty />
                    </motion.div>
                </div>

                {/* Right - Sidebar with Messages & Map */}
                <motion.div variants={sectionVariants} className="col-span-4">
                    <Sidebar />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default UserDashboardListingDesktop;
