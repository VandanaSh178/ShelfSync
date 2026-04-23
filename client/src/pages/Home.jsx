import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import Sidebar from "../layout/SideBar";
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashBoard';
import BookManagement from '../components/BookManagement';
import Catalog from '../components/Catalog';
import Users from '../components/Users';
import MyBorrowedBooks from '../components/MyBorrowedBooks';
import Header from '../layout/Header';
import AIRecommendations from '../components/AIRecommendations';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-[#faf6f0] overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        isSideBarOpen={isSidebarOpen}
        setIsSideBarOpen={setIsSidebarOpen}
        setSelectedComponent={setSelectedComponent}
        selectedComponent={selectedComponent}
      />

      {/* MAIN - only this scrolls */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto md:ml-[232px]">

        <Header />

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden sticky top-0 z-40 flex justify-end p-3 bg-[#faf6f0] border-b border-[#e8ddd0]">
          <div
            className="bg-[#1a1612] rounded-xl h-9 w-9 flex justify-center items-center text-white shadow-lg cursor-pointer active:scale-90 transition-transform"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <GiHamburgerMenu className="text-base" />
          </div>
        </div>

        {/* CONTENT — no extra padding; each component owns its own */}
        <div className="flex-1 min-h-0">
          {(() => {
            switch (selectedComponent) {
              case "dashboard":
                return user?.role === "user" ? <UserDashboard /> : <AdminDashboard />;
              case "books":
                return <BookManagement />;
              case "catalog":
                return <Catalog />;
              case "users":
                return user?.role === "admin" ? <Users /> : null;
              case "my borrowed books":
                return <MyBorrowedBooks />;
              case "ai":
                return <AIRecommendations />;
              default:
                return user?.role === "user" ? <UserDashboard /> : <AdminDashboard />;
            }
          })()}
        </div>

      </div>
    </div>
  );
};

export default Home;