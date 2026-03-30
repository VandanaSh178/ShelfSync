import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // 1. Wait for the 'Boot Sequence' (Don't redirect while fetching user)
  if (loading) return null; 

  // 2. Security Check
  // If the user isn't authenticated, send them to the login gate
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // 3. Access Granted
  // Outlet renders the child components (like Home/Dashboard)
  return <Outlet />;
};

// ❌ If this line is missing or misspelled, App.jsx crashes
export default ProtectedRoute;