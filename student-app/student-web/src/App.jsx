import "./App.css";
import { Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import HomePage from "./Pages/HomePage";
import DiscoverEvents from "./Pages/DiscoverEvents";
import CreateEvent from "./Pages/CreateEvents";
import UserProfile from "./Pages/OrganizerHome";
import Help from "./Pages/Help";
import ResetPasswordPage from "./Pages/ResetPasswordPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/discoverEvents" element={<DiscoverEvents />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
      <Route path="/createEvents" element={<CreateEvent />} />
      <Route path="/organizerProfile" element={<UserProfile />} />
      <Route path="/help" element={<Help />} />
      <Route path="/resetPassword" element={< ResetPasswordPage />} />
    </Routes>
  );
}

export default App;
