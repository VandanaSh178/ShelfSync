import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // 1. Wait for the boot sequence to finish
  if (loading) return null; 

  // 2. Check Security Clearance
  // If not logged in, or logged in but NOT an admin, redirect to safety
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // 3. Access Granted
  return <Outlet />;
};

// ❌ If this line is missing, App.jsx will throw that SyntaxError
export default AdminRoute;