import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import SideBar from "../layout/SideBar";
import Header from "../layout/Header"; // Import your new Header
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashBoard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // 🔥 Dynamic Component Renderer
  const renderComponent = () => {
    switch (selectedComponent) {
      case "dashboard":
        return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
      case "books":
        return <BookManagement />;
      case "catalog":
        return user?.role === "admin" ? <Catalog /> : <Navigate to="/" />;
      case "users":
        return user?.role === "admin" ? <Users /> : <Navigate to="/" />;
      case "borrowed":
        return <MyBorrowedBooks />;
      case "add-admin":
        return user?.role === "admin" ? <div>Add Admin Form Component</div> : null;
      case "settings":
        return <div>Settings / Update Credentials Component</div>;
      default:
        return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    if (window.innerWidth < 768) {
      setIsSideBarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={handleComponentChange}
        selectedComponent={selectedComponent}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Mobile Navbar (Show Header + Hamburger on Mobile) */}
        <div className="md:hidden flex items-center bg-white border-b border-gray-200">
           <div className="pl-4">
              <GiHamburgerMenu
                className="text-2xl cursor-pointer text-gray-700"
                onClick={() => setIsSideBarOpen(!isSideBarOpen)}
              />
           </div>
           <div className="flex-1">
              <Header />
           </div>
        </div>

        {/* Rendered Component Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderComponent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;