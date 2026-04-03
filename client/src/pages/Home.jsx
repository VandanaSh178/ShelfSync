import React, { useState } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux"; 
import { Navigate } from "react-router-dom"; 
import Sidebar from "../layout/SideBar"; 
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashBoard';
import BookManagement from '../components/BookManagement';
import Catalog from '../components/Catalog';
import Users from '../components/Users';
import MyBorrowedBooks from '../components/MyBorrowedBooks';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Note: Keep this commented out or active based on your routing setup
  // if (!isAuthenticated) { return <Navigate to="/login" replace />; }

  return (
    <div className="relative min-h-screen bg-[#faf9f6] flex overflow-hidden">
      {/* MOBILE HAMBURGER */}
      <div className="md:hidden z-50 absolute right-6 top-6 bg-black rounded-xl h-10 w-10 flex justify-center items-center text-white shadow-lg cursor-pointer active:scale-90 transition-transform">
        <GiHamburgerMenu 
          className="text-xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      </div>

      {/* NAVIGATION WING */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        setSelectedComponent={setSelectedComponent} 
        selectedComponent={selectedComponent}
      />

      {/* MAIN VIEWPORT */}
      <main className="flex-1 transition-all duration-500 ease-in-out overflow-y-auto">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          
          {/* WELCOME SECTION */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-10">
             <h1 className="text-4xl font-serif text-gray-900">
               Welcome back, <span className="italic text-orange-600">{user?.name}</span>
             </h1>
             <p className="text-gray-400 text-xs uppercase tracking-[0.3em] mt-2 font-bold">
               Registry Access: {user?.role}
             </p>
          </section>

          {/* DYNAMIC CONTENT SWITCHER */}
          <div className="mt-8">
            {(() => {
              switch(selectedComponent) {
                case "dashboard":
                  return user?.role === "user" ? <UserDashboard /> : <AdminDashboard />;
                case "books":
                  return <BookManagement />;
                case "catalog":
                  return user?.role === "admin" ? <Catalog /> : null;
                case "users":
                  return user?.role === "admin" ? <Users /> : null;
                case "my borrowed books":
                  return <MyBorrowedBooks />;
                default:
                  return user?.role === "user" ? <UserDashboard /> : <AdminDashboard />;
              }
            })()}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;