import './App.css'
import {Route, Routes} from "react-router-dom";
import LoginPage from './Pages/loginPage';
import RegisterPage from './Pages/RegisterPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import HomePage from './Pages/HomePage';


function App() {
return (
  <Routes> 
    <Route path="/" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
    <Route path="/home" element={<HomePage />} />



  </Routes>
)
  
}

export default App
