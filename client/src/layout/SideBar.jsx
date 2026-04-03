import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-hot-toast"; // Changed to match your Login/Register toast choice
import { useNavigate } from "react-router-dom";

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
  BookOpenCheck 
} from "lucide-react";
import logo_with_title from "../assets/logo-with-title.png";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  setSelectedComponent,
  selectedComponent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Ensure this matches your store.js (e.g., popup: popUpReducer)
  const { addNewAdminPopup,settingPopup } = useSelector((state) => state.popup); 
  const { user, error, message,loading,isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    // The slice handles the redirect, but this is a safe fallback
    navigate("/login"); 
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
    `w-full py-3 px-4 rounded-xl flex items-center space-x-3 transition-all duration-300 group relative ${
      selectedComponent === name 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
        : "hover:bg-white/5 text-gray-400 hover:text-white"
    }`;

  return (
    <> 
      {/* MOBILE OVERLAY */}
      {isSideBarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] md:hidden"
          onClick={() => setIsSideBarOpen(false)}
        />
      )}

      <aside
        className={`fixed ${
          isSideBarOpen ? "left-0" : "-left-full"
        } top-0 z-50 transition-all duration-500 md:relative md:left-0 flex w-72 bg-black text-white flex-col h-screen border-r border-white/5 shadow-2xl`}
      >
        <button 
          onClick={() => setIsSideBarOpen(false)}
          className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg md:hidden"
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

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">Core</p>
          
          <button className={navBtn("dashboard")} onClick={() => handleNavClick("dashboard")}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-bold text-[11px] uppercase tracking-widest">Dashboard</span>
          </button>

          <button className={navBtn("books")} onClick={() => handleNavClick("books")}>
            <Book className="w-5 h-5" />
            <span className="font-bold text-[11px] uppercase tracking-widest">Catalog</span>
          </button>

          {user?.role === "admin" && (
            <div className="pt-8 space-y-2">
              <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">Control Plane</p>
              <button className={navBtn("catalog")} onClick={() => handleNavClick("catalog")}>
                <Library className="w-5 h-5" />
                <span className="font-bold text-[11px] uppercase tracking-widest">Inventory</span>
              </button>
              <button className={navBtn("users")} onClick={() => handleNavClick("users")}>
                <Users className="w-5 h-5" />
                <span className="font-bold text-[11px] uppercase tracking-widest">User Base</span>
              </button>
              <button 
                className="w-full py-3 px-4 rounded-xl flex items-center space-x-3 transition-all hover:bg-orange-500 text-orange-500 hover:text-white border border-orange-500/20 mt-6"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-5 h-5" />
                <span className="font-bold text-[10px] uppercase tracking-widest text-left">New Admin</span>
              </button>
            </div>
          )}

          {user?.role === "user" && (
            <div className="pt-8">
              <p className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-4">Personal</p>
              <button className={navBtn("my borrowed books")} onClick={() => handleNavClick("my borrowed books")}>
                <BookOpenCheck className="w-5 h-5" />
                <span className="font-bold text-[11px] uppercase tracking-widest">My Records</span>
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          {/* Linked to dashboard for now as a safe default */}
          <button className={navBtn("settings")} onClick={() => handleNavClick("dashboard")}>
            <Settings className="w-5 h-5" />
            <span className="font-bold text-[11px] uppercase tracking-widest">Security</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full py-4 px-4 rounded-xl flex items-center space-x-3 text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all group mt-2"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-[11px] uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Popups */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </> 
  );
};

export default SideBar;