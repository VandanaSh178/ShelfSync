import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AdminDashboard from "./components/AdminDashBoard";

const PUBLIC_PATHS = [
  '/register',
  '/login',
  '/password/forgot',
  '/otp-verification',
  '/password/reset',
];

// ✅ Blocks unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// ✅ Blocks non-admins
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

// ✅ Redirects already logged-in users away from login/register
// NO loading check — don't block or unmount guest pages
const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/"} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const isPublicPage = PUBLIC_PATHS.some(path =>
      location.pathname.startsWith(path)
    );

    // Only call getUser on protected pages
    if (!isPublicPage) {
      dispatch(getUser());
    }

    // Always fetch books
    dispatch(fetchBooks());
  }, [location.pathname]); // ✅ re-runs when route changes

  return (
    <Routes>
      {/* 🏠 USER */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

      {/* 🛠️ ADMIN */}
      <Route path="/admin/dashboard" element={<AdminRoute><Home /></AdminRoute>} />

      {/* 🔓 GUEST ONLY */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* 🔓 FULLY PUBLIC */}
      <Route path="/password/forgot" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />

      {/* ✅ OTP — no GuestRoute, fully public */}
      <Route path="/otp-verification/:email" element={<OTPVerification />} />

      {/* Wildcard */}
      <Route path="*" element={<Navigate to="/login" replace />} />
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