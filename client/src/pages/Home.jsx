import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { getUser } from "../store/slices/authSlice";

import SideBar from "../layout/SideBar";
import Header from "../layout/Header"; 
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashBoard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // 1. Ensure user data is always fresh on mount
  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  // 2. Loading State: Prevents "Flicker" while checking authentication
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 animate-pulse font-bold">
            Synchronizing Shelf...
          </p>
        </div>
      </div>
    );
  }

  // 3. Protection: If not loading and not authenticated, kick to login
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  const renderComponent = () => {
    const isAdmin = user?.role === "admin";

    switch (selectedComponent) {
      case "dashboard":
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      case "books":
        return <BookManagement />;
      case "catalog":
        return <Catalog />;
      case "users":
        return isAdmin ? <Users /> : <Navigate to="/" />;
      case "borrowed":
        return <MyBorrowedBooks />;
      case "settings":
        return (
          <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-3xl font-serif">Account Settings</h2>
            <p className="text-gray-400 mt-2 text-sm">Update your administrative credentials and preferences.</p>
          </div>
        );
      default:
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    if (window.innerWidth < 768) {
      setIsSideBarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={handleComponentChange}
        selectedComponent={selectedComponent}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Unified Header Strategy */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center pr-4">
          <div className="md:hidden pl-6">
            <button 
              onClick={() => setIsSideBarOpen(!isSideBarOpen)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <GiHamburgerMenu className="text-2xl text-gray-900" />
            </button>
          </div>
          <div className="flex-1">
            <Header />
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderComponent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;