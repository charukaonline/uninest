import { Route, Routes } from "react-router-dom";
import UserSignupPage from "./pages/UserSignupPage";

function App() {
  return (
    <>
      <Routes>

        {/* Main pages */}
        <Route path="/" element={"Landing page"} />

        {/* Student signup and signin */}
        <Route path="/auth/user-signup" element={<UserSignupPage />} />

        {/* House owner signup and signin */}
      </Routes>
    </>
  );
}

export default App;
