import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

// Icons
import { RiAdminFill } from "react-icons/ri";
import { 
  Settings, 
  LayoutDashboard, 
  Book, 
  Library, 
  Users, 
  LogOut, 
  X,
  BookOpenCheck // Better icon for "My Borrows"
} from "lucide-react";
import logo_with_title from "../assets/logo-with-title.png";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  setSelectedComponent,
  selectedComponent,
}) => {
  const dispatch = useDispatch();
  const { user, error, message } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleNavClick = (component) => {
    setSelectedComponent(component);
    if (window.innerWidth < 768) {
      setIsSideBarOpen(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  const navBtn = (name) =>
    `w-full py-3 px-4 rounded-xl flex items-center space-x-3 transition-all duration-300 group ${
      selectedComponent === name 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
        : "hover:bg-gray-900 text-gray-400 hover:text-white"
    }`;

  return (
    <aside
      className={`fixed ${
        isSideBarOpen ? "left-0" : "-left-full"
      } top-0 z-50 transition-all duration-500 md:relative md:left-0 flex w-72 bg-black text-white flex-col h-screen border-r border-gray-900 shadow-2xl`}
    >
      <button 
        onClick={() => setIsSideBarOpen(false)}
        className="absolute top-6 right-6 p-2 bg-gray-900 rounded-lg md:hidden"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>

      <div className="flex items-center justify-center px-8 py-10">
        <img
          src={logo_with_title}
          alt="ShelfSync Logo"
          className="w-40 object-contain brightness-0 invert"
        />
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold mb-4">Main Menu</p>
        
        {/* Dashboard - Fixed Icon & Click Handler */}
        <button className={navBtn("dashboard")} onClick={() => handleNavClick("dashboard")}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-widest">Overview</span>
        </button>

        {/* Books - Fixed Icon & Click Handler */}
        <button className={navBtn("books")} onClick={() => handleNavClick("books")}>
          <Book className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-widest">Library</span>
        </button>

        {user?.role === "admin" && (
          <div className="pt-6 space-y-2">
            <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold mb-4">Management</p>
            <button className={navBtn("catalog")} onClick={() => handleNavClick("catalog")}>
              <Library className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-widest">Inventory</span>
            </button>
            <button className={navBtn("users")} onClick={() => handleNavClick("users")}>
              <Users className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-widest">Members</span>
            </button>
            <button 
              className="w-full py-3 px-4 rounded-xl flex items-center space-x-3 transition-all hover:bg-orange-500/10 text-orange-500 border border-orange-500/20 mt-4"
              onClick={() => dispatch(toggleAddNewAdminPopup())}
            >
              <RiAdminFill className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-widest text-left">Grant Admin Access</span>
            </button>
          </div>
        )}

        {user?.role === "user" && (
          <div className="pt-6">
            <p className="px-4 text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold mb-4">Personal</p>
            <button className={navBtn("my borrowed books")} onClick={() => handleNavClick("my borrowed books")}>
              <BookOpenCheck className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-widest">My Borrows</span>
            </button>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-900 space-y-2">
        <button className={navBtn("settings")} onClick={() => handleNavClick("settings")}>
          <Settings className="w-5 h-5" />
          <span className="font-bold text-xs uppercase tracking-widest">Security</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full py-4 px-4 rounded-xl flex items-center space-x-3 text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Exit System</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;