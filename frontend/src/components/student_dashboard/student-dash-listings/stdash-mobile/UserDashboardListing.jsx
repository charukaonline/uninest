import React from "react";
import { Grid } from "antd";
import UserDashboardMobile from "./MobileUserDashboard.jsx";
import UserDashboardListingDesktop from "../UserDashboard/UserDashboard.jsx";


const { useBreakpoint } = Grid;

const UserDashboardListing = () => {
    const screens = useBreakpoint();

    return screens.md ? <UserDashboardListingDesktop /> : <UserDashboardMobile />;
};

export default UserDashboardListing;
