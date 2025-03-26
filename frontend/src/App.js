import React from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Account from "./pages/Account";
import Chatbot from "./pages/Chatbot";
import UploadImage from './pages/UploadImage';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// Separate component to handle Navbar visibility
const AppContent = () => {
  const location = useLocation();
  
  // Hide Navbar on Login and Signup pages
  const hideNavbar = location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/upload" element={<UploadImage />} />
      </Routes>
    </>
  );
};

export default App;
