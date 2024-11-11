import { Route, Routes } from "react-router-dom";

import UserSignupPage from "./pages/UserSignupPage";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>

        {/* Main pages */}
        <Route path="/" element={<Home />} />

        {/* Student signup and signin */}
        <Route path="/auth/user-signup" element={<UserSignupPage />} />

        {/* House owner signup and signin */}
      </Routes>
    </>
  );
}

export default App;