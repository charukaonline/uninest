import { Route, Routes } from "react-router-dom";

import UserSignupPage from "./pages/UserSignupPage";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import UserSigninPage from "./pages/UserSigninPage";
import HouseownerSigninPage from "./pages/HouseownerSigninPage";
import HouseownerSignupPage from "./pages/HouseownerSignupPage";
import AllListings from "./pages/AllListings";
import PropertyInfo from "./pages/PropertyInfo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DashboardLayout from "./pages/StdDashboard";

function App() {
  return (
    <>
      <Routes>
        {/* Main pages */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Student signup and signin */}
        <Route path="/auth/user-signup" element={<Layout><UserSignupPage /></Layout>} />
        <Route path="/auth/user-signin" element={<Layout><UserSigninPage /></Layout>} />

        {/* House owners signup and signin */}
        <Route path='/auth/houseowner-signup' element={<Layout><HouseownerSignupPage /></Layout>} />
        <Route path='/auth/houseowner-signin' element={<Layout><HouseownerSigninPage /></Layout>} />

        {/* All Listings */}
        <Route path='/all listings' element={<Layout><AllListings /></Layout>} />

        {/* One Property Details */}
        <Route path='/property/:propertyId' element={<Layout><PropertyInfo /></Layout>} />

        {/* Privacy Policy */}
        <Route path='/privacy-policy' element={<Layout><PrivacyPolicy /></Layout>} />
        
        {/* Student Dashboard */}
        <Route path='/std-dashboard' element={<DashboardLayout />} />
      </Routes>
    </>
  );
}

export default App;
