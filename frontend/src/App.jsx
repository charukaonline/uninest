import { Route, Routes } from "react-router-dom";

import UserSignupPage from "./pages/UserSignupPage";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import StudentLogin from "./components/UserSignin";

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
        <Route path="/auth/user-signup" element={<UserSignupPage />} />
        <Route path="/auth/user-signin" element={<StudentLogin />} />

        {/* House owner signup and signin */}
      </Routes>
    </>
  );
}

export default App;
