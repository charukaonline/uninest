import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboardstructure.jsx";
import DashboardMobile from "./DashboardMobile.jsx";

const StudentDashboard = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // adjust breakpoint as needed
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile ? <DashboardMobile /> : <Dashboard />;
};

export default StudentDashboard;
