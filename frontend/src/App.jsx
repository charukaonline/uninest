import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import UserSignupPage from "./pages/(auth)/UserSignupPage";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import UserSigninPage from "./pages/(auth)/UserSigninPage";
import HouseownerSigninPage from "./pages/(auth)/HouseownerSigninPage";
import HouseownerSignupPage from "./pages/(auth)/HouseownerSignupPage";
import PendingHouseowner from "./pages/(auth)/PendingHouseowner";
import AllListings from "./pages/AllListings";
import ListingInfo from "./pages/ListingInfo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import StudentDashboard from "./pages/(StdDashboard)/StdDashboard";
import AdminDashboard from "./pages/(AdminDashboard)/AdminDashboard";
import NotFound from "./pages/404Page";
import UserPreference from "./components/signup_pages/UserPreference";
import {
  ProtectedRoute,
  AdminProtectedRoute,
  LandlordProtectedRoute,
} from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import AdminLogin from "./pages/(auth)/AdminLogin";
import LoadingSpinner from "./components/include/LoadingSpinner";
import {
  AuthenticatedUser,
  AuthenticatedAdmin,
  AuthenticatedLandlord,
} from "./components/AuthenticatedUser";
import EmailVerificationPage from "./pages/(auth)/EmailVerificationPage";
import ManageUsers from "./pages/(AdminDashboard)/ManageUsers";
import LandlordDashboard from "./pages/(LandlordDashboard)/LandlordDashboard";
import AddListings from "./pages/(LandlordDashboard)/AddListings";
import ManageListings from "./pages/(AdminDashboard)/ManageListings";
import AddUniversity from "./pages/(AdminDashboard)/AddUniversity";
import StdSettings from "./pages/(StdDashboard)/StdSettings";
import StdInbox from "./pages/(StdDashboard)/StdInbox";
import LandlordListings from "./pages/(LandlordDashboard)/LandlordListings";
import Report from "./pages/(AdminDashboard)/Report";
import Feedback from "./pages/(AdminDashboard)/Feedback";
import LandlordInbox from "./pages/(LandlordDashboard)/LandlordInbox";
import Search from "./pages/Search";
import Pricing from "./pages/(LandlordDashboard)/Pricing";
import StdSchedule from "./pages/(StdDashboard)/StdSchedule";
import StdNotifications from "./pages/(StdDashboard)/StdNotifications"; // Fixed: Changed from StdNotification to StdNotifications
import LandlordSchedules from "./pages/(LandlordDashboard)/LandlordSchedules";
import HandlePages from "./pages/(AdminDashboard)/HandlePages";
import PageStatusWrapper from "./components/include/PageStatusWrapper";
import ListingsAnalytics from "./pages/(LandlordDashboard)/ListingsAnalytics";
import ForgotPasswordPage from "./pages/(auth)/ForgotPasswordPage";
import ResetPasswordPage from "./pages/(auth)/ResetPasswordPage";
import LandlordForgotPasswordPage from "./pages/(auth)/LandlordForgotPasswordPage";
import LandlordResetPasswordPage from "./pages/(auth)/LandlordResetPasswordPage";
import Analytics from "./pages/(AdminDashboard)/Analytics";

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      <PageStatusWrapper>
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
          <Route
            path="/search"
            element={
              <Layout>
                <Search />
              </Layout>
            }
          />
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
            element={<EmailVerificationPage />}
          />
          {/* House owners signup and signin */}
          <Route
            path="/auth/houseowner-signup"
            element={
              <AuthenticatedLandlord>
                <Layout>
                  <HouseownerSignupPage />
                </Layout>
              </AuthenticatedLandlord>
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
              <AuthenticatedLandlord>
                <Layout>
                  <HouseownerSigninPage />
                </Layout>
              </AuthenticatedLandlord>
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
          {/* One Listing Details */}
          <Route
            path="/listing/:listingId"
            element={
              <Layout>
                <ListingInfo />
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
          <Route
            path="/student/:userId/:email"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:userId/:email/settings"
            element={
              <ProtectedRoute>
                <StdSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:userId/:email/inbox"
            element={
              <ProtectedRoute>
                <StdInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:userId/:email/schedule"
            element={
              <ProtectedRoute>
                <StdSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:userId/:email/notifications"
            element={
              <ProtectedRoute>
                <StdNotifications />
              </ProtectedRoute>
            }
          />
          {/* Landlord Dashboard - Update this route */}
          <Route
            path="/landlord/:landlordId/:email"
            element={
              <LandlordProtectedRoute>
                <LandlordDashboard />
              </LandlordProtectedRoute>
            }
          />
          <Route
            path="/landlord/:landlordId/:email/add-listings"
            element={
              <LandlordProtectedRoute>
                <AddListings />
              </LandlordProtectedRoute>
            }
          />
          <Route
            path="/landlord/:landlordId/:email/my-listings"
            element={
              <LandlordProtectedRoute>
                <LandlordListings />
              </LandlordProtectedRoute>
            }
          />
          <Route
            path="/landlord/:landlordId/:email/inbox"
            element={
              <LandlordProtectedRoute>
                <LandlordInbox />
              </LandlordProtectedRoute>
            }
          />
          <Route
            path="/landlord/:landlordId/:email/schedule"
            element={
              <LandlordProtectedRoute>
                <LandlordSchedules />
              </LandlordProtectedRoute>
            }
          />
          <Route
            path="/landlord/:landlordId/:email/pricing"
            element={
              <LandlordProtectedRoute>
                <Pricing />
              </LandlordProtectedRoute>
            }
          />
          <Route
            path="/landlord/:landlordId/:email/my-listings/:listingId"
            element={
              <LandlordProtectedRoute>
                <ListingsAnalytics />
              </LandlordProtectedRoute>
            }
          />
          {/* Admin Login */}
          <Route
            path="/auth/uninest-admin"
            element={
              <AuthenticatedAdmin>
                <AdminLogin />
              </AuthenticatedAdmin>
            }
          />
          {/* Admin Dashboard */}
          <Route
            path="/admin/:adminId/:email"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/:adminId/:email/users"
            element={
              <AdminProtectedRoute>
                <ManageUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/:adminId/:email/listings"
            element={
              <AdminProtectedRoute>
                <ManageListings />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/:adminId/:email/add-university"
            element={
              <AdminProtectedRoute>
                <AddUniversity />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/:adminId/:email/analytics"
            element={
              <AdminProtectedRoute>
                <Analytics />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/:adminId/:email/reports"
            element={
              <AdminProtectedRoute>
                <Report />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/:adminId/:email/feedbacks"
            element={
              <AdminProtectedRoute>
                <Feedback />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/:adminId/:email/handle-pages"
            element={
              <AdminProtectedRoute>
                <HandlePages />
              </AdminProtectedRoute>
            }
          />
          // Add these routes to your router
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          {/* <Route path="/admin/analytics" element={<Analytics />} /> */}
          // Add these routes to your router configuration
          <Route
            path="/auth/landlord-forgot-password"
            element={<LandlordForgotPasswordPage />}
          />
          <Route
            path="/auth/landlord-reset-password"
            element={<LandlordResetPasswordPage />}
          />
        </Routes>
      </PageStatusWrapper>
    </>
  );
}

export default App;
