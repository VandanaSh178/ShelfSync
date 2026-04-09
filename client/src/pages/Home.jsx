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

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
      
      {/* SIDEBAR */}
      <Sidebar 
        isSideBarOpen={isSidebarOpen} 
        setIsSideBarOpen={setIsSidebarOpen} 
        setSelectedComponent={setSelectedComponent} 
        selectedComponent={selectedComponent}
      />

      {/* MAIN - only this scrolls */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto ml-0 md:ml-64">

        <Header/>
        
        {/* MOBILE HAMBURGER */}
        <div className="md:hidden sticky top-0 z-40 flex justify-end p-4 bg-[#faf9f6]">
          <div className="bg-black rounded-xl h-10 w-10 flex justify-center items-center text-white shadow-lg cursor-pointer active:scale-90 transition-transform">
            <GiHamburgerMenu 
              className="text-xl"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          </div>
        </div>

        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          
          

          {/* CONTENT */}
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
      </div>
    </div>
  );
};

export default Home;