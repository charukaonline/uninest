import { Route, Routes } from "react-router-dom";

import UserSignupPage from "./pages/(auth)/UserSignupPage";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import UserSigninPage from "./pages/(auth)/UserSigninPage";
import HouseownerSigninPage from "./pages/(auth)/HouseownerSigninPage";
import HouseownerSignupPage from "./pages/(auth)/HouseownerSignupPage";
import PendingHouseowner from "./pages/(auth)/PendingHouseowner";
import AllListings from "./pages/AllListings";
import PropertyInfo from "./pages/PropertyInfo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import StudentDashboard from "./pages/(StdDashboard)/StdDashboard";
import AdminDashboard from "./pages/(AdminDashboard)/AdminDashboard";
import NotFound from "./pages/404Page";
import UserPreference from "./components/signup_pages/UserPreference";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthInitializer from "./store/authStore";
import AdminLogin from "./pages/(auth)/AdminLogin";

function App() {
  useAuthInitializer();

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
        <Route path="*" element={<NotFound />} />

        {/* Student signup and signin */}
        <Route
          path="/auth/user-signup"
          element={
            <Layout>
              <UserSignupPage />
            </Layout>
          }
        />
        <Route
          path="/auth/user-signin"
          element={
            <Layout>
              <UserSigninPage />
            </Layout>
          }
        />
        <Route
          path="/auth/google/success"
          element={
            <Layout>
              <UserPreference />
            </Layout>
          }
        />

        {/* House owners signup and signin */}
        <Route
          path="/auth/houseowner-signup"
          element={
            <Layout>
              <HouseownerSignupPage />
            </Layout>
          }
        />
        <Route
          path="/auth/verification-pending"
          element={
            <Layout>
              <PendingHouseowner />
            </Layout>
          }
        />
        <Route
          path="/auth/houseowner-signin"
          element={
            <Layout>
              <HouseownerSigninPage />
            </Layout>
          }
        />

        {/* All Listings */}
        <Route
          path="/all-listings"
          element={
            <Layout>
              <AllListings />
            </Layout>
          }
        />

        {/* One Property Details */}
        <Route
          path="/property/:propertyId"
          element={
            <Layout>
              <PropertyInfo />
            </Layout>
          }
        />

        {/* Privacy Policy */}
        <Route
          path="/privacy-policy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />

        {/* Student Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/sd/:userId/:email" element={<StudentDashboard />} />
        </Route>

        {/* Admin Login */}
        <Route path="/auth/uninest-admin" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/ad/:adminId/:email" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
