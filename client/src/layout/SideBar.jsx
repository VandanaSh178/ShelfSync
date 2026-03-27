import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuth } from "../store/slices/authSlice";
import { toast } from "react-toastify";

// Icons
import { RiAdminFill } from "react-icons/ri";
import { Settings } from "lucide-react"; // Renamed for standard component naming
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import usersIcon from "../assets/people.png";
import closeIcon from "../assets/close-square.png";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  setSelectedComponent,
  selectedComponent,
}) => {
  const dispatch = useDispatch();
  const {addNewAdminPopup}=useSelector(state=>state.popup);
  const { error, message, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuth());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuth());
    }
  }, [dispatch, error, message]);

  // 🔥 Common button style helper
  const navBtn = (name) =>
    `w-full py-2 px-3 rounded-md flex items-center space-x-3 transition ${
      selectedComponent === name ? "bg-gray-800" : "hover:bg-gray-800"
    }`;

  return (
    <aside
      className={`fixed ${
        isSideBarOpen ? "left-0" : "-left-full"
      } top-0 z-20 transition-all duration-300 md:relative md:left-0 flex w-64 bg-black text-white flex-col h-screen border-r border-gray-800`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center px-4 py-6 border-b border-gray-800">
        <img
          src={logo_with_title}
          alt="logo"
          className="w-36 object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <button
          className={navBtn("dashboard")}
          onClick={() => setSelectedComponent("dashboard")}
        >
          <img src={dashboardIcon} alt="dashboard" className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        {/* Books */}
        <button
          className={navBtn("books")}
          onClick={() => setSelectedComponent("books")}
        >
          <img src={bookIcon} alt="books" className="w-5 h-5" />
          <span>Books</span>
        </button>

        {/* Admin Only */}
        {user?.role === "admin" && (
          <>
            <button
              className={navBtn("catalog")}
              onClick={() => setSelectedComponent("catalog")}
            >
              <img src={catalogIcon} alt="catalog" className="w-5 h-5" />
              <span>Catalog</span>
            </button>

            <button
              className={navBtn("users")}
              onClick={() => setSelectedComponent("users")}
            >
              <img src={usersIcon} alt="users" className="w-5 h-5" />
              <span>Users</span>
            </button>

            <button
              className={navBtn("add-admin")}
              onClick={() => dispatch(toggleAddNewAdminPopup())}
            >
              <RiAdminFill className="w-5 h-5" />
              <span>Add New Admin</span>
            </button>
          </>
        )}

        {/* Borrowed Books (User only) */}
        {user?.role === "user" && (
          <button
            className={navBtn("borrowed")}
            onClick={() => setSelectedComponent("borrowed")}
          >
            <img src={bookIcon} alt="borrowed" className="w-5 h-5" />
            <span>My Books</span>
          </button>
        )}
      </nav>

      {/* Settings / Update Credentials */}
      <div className="px-4 pb-2">
        <button
          className={navBtn("settings")}
          onClick={() => setSelectedComponent("settings")}
        >
          <Settings className="w-5 h-5 text-gray-400" />
          <span>Update Credentials</span>
        </button>
      </div>

      {/* Logout Section */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 rounded-md flex items-center space-x-3 hover:bg-red-600 transition"
        >
          <img src={logoutIcon} alt="logout" className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
      <img src={closeIcon} alt="icon" onClick={()=>setIsSideBarOpen(!isSideBarOpen)} className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden" />
    </aside>
  );
};

export default SideBar;