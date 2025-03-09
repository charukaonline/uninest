import React from "react";
import { Grid } from "antd";
import UserDashboardMobile from "./stdash-mobile/MobileUserDashboard.jsx";
import UserDashboardListingDesktop from "../student-dash-listings/stdash-desktop/UserDashboard.jsx";


const { useBreakpoint } = Grid;

const UserDashboardListing = () => {
    const screens = useBreakpoint();

    return screens.md ? <UserDashboardListingDesktop /> : <UserDashboardMobile />;
};

export default UserDashboardListing;
