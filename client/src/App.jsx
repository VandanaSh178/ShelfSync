import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getUser } from './store/slices/authSlice';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from "./pages/OTPVerify";
import AdminDashboard from "./components/AdminDashBoard";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for active session on mount
    dispatch(getUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* 🏠 USER ACCESS */}
        <Route path="/" element={<Home />} />

        {/* 🛠️ ADMIN ACCESS */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 🔓 PUBLIC GATES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTPVerification />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        
        {/* Wildcard Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#000000',
            color: '#fff',
            padding: '16px 24px',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            borderRadius: '0px',
            borderLeft: '4px solid #f97316',
          },
        }}
      />
    </Router>
  );
};

export default App;