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
import { useAuthStore } from "./store/authStore";
import AdminLogin from "./pages/(auth)/AdminLogin";
import LoadingSpinner from "./components/include/LoadingSpinner";
import AuthenticatedUser from "./components/AuthenticatedUser";
import { useEffect } from "react";
import EmailVerificationPage from "./pages/(auth)/EmailVerificationPage";

function App() {

  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

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
            <AuthenticatedUser>
              <Layout>
                <UserSignupPage />
              </Layout>
            </AuthenticatedUser>
          }
        />
        <Route
          path="/auth/user-signin"
          element={
            <AuthenticatedUser>
              <Layout>
                <UserSigninPage />
              </Layout>
            </AuthenticatedUser>
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
        <Route
          path="/auth/email-verify"
          element={<EmailVerificationPage />
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
        <Route path="/sd/:userId/:email" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

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
