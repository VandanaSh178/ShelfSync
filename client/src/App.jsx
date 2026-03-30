import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from "./pages/OTPVerify";
import AdminDashboard from "./components/AdminDashBoard"; // The command center

// Protection Components
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute"; // For Librarian/Admin access

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUser } from './store/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();

useEffect(() => {
  // Silent check to see if user has an active session cookie
  dispatch(getUser());
}, [dispatch]);
  return (
    <Router>
      <Routes>
        🏠 USER ACCESS */
        { <Route 
          path="/" 
          element={
            // <ProtectedRoute>
              <Home />
            // </ProtectedRoute>
          } 
        /> }

        {/* 🛠️ ADMIN ACCESS */}
        {<Route 
          path="/admin/dashboard" 
          element={
            // <AdminRoute>
               <AdminDashboard />
            // </AdminRoute>
          } 
        />}

        {/* 🔓 PUBLIC GATES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTPVerification />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        
        {/* Redirect unknown paths to Home (which then checks auth) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Global Notification Terminal */}
      <Toaster 
        position="bottom-right" // Often cleaner for desktop-heavy admin apps
        reverseOrder={false}
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
            borderLeft: '4px solid #f97316', // Orange accent for your brand
          },
        }}
      />
    </Router>
  );
};

export default App;