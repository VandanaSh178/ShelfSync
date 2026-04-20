import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './store/slices/authSlice';
import { fetchBooks } from './store/slices/bookSlice';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OTPVerification from "./pages/OTPVerify";
import LandingPage from './pages/LandingPage';

// FIX: All guards read `initializing` and return null (blank) while getUser()
// is still in flight. Without this, a logged-in user hitting refresh briefly
// sees the login page before being redirected — causing a visible flash.

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useSelector((state) => state.auth);
  if (initializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, initializing, user } = useSelector((state) => state.auth);
  if (initializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, initializing, user } = useSelector((state) => state.auth);
  if (initializing) return null;
  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBooks());
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<AdminRoute><Home /></AdminRoute>} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />
      <Route path="/otp-verification/:email" element={<OTPVerification />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
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