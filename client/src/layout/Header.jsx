import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { logoutUser } from "../store/slices/authSlice";
import { fetchBooks } from "../store/slices/bookSlice";
import { Settings, Bell, ChevronDown, BookOpen, LogOut, User, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "../popups/ProfilePopup";

const Header = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { books = [] } = useSelector((state) => state.books);

  const [dateTime, setDateTime] = useState({ time: "", date: "" });
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setDateTime({
        time: `${hours}:${minutes} ${ampm}`,
        date: now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = books.filter((b) =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, books]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
  <>
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100"
        : "bg-white/80 backdrop-blur-md border-b border-gray-100/60"
    }`}>
      <div className="flex items-center justify-between px-6 py-3">

        {/* LEFT — Brand + Time */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 leading-none">ShelfSync</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">Library OS</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200" />

          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 tabular-nums leading-none">{dateTime.time}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{dateTime.date}</p>
          </div>
        </div>

        {/* CENTER — Search */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-8">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 focus:bg-white transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {searchResults.map((book) => (
                  <div key={book._id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => { setSearchQuery(""); setSearchResults([]); setSelectedComponent?.("books"); }}
                  >
                    <img
                      src={book.coverImage?.url || "https://placehold.co/30x40"}
                      className="w-7 h-9 object-cover rounded flex-shrink-0"
                      onError={(e) => { e.target.src = "https://placehold.co/30x40"; }}
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{book.title}</p>
                      <p className="text-[10px] text-gray-400">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* Role Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user?.role === "admin" ? "bg-purple-500" : "bg-emerald-500"}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {user?.role === "admin" ? "Admin" : "Member"}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-700">Notifications</p>
                </div>
                <div className="px-4 py-6 text-center">
                  <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No new notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all group"
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">{initials}</span>
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || "Guest"}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-none">{user?.email?.split("@")[0] || "—"}</p>
              </div>
              <ChevronDown className={`w-3 h-3 text-gray-400 hidden sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-black text-gray-900">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => { setProfilePopupOpen(true);
                      setProfileOpen(false);
                     }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </button>
                  <button
                    onClick={() => { dispatch(toggleSettingPopup()); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Settings
                  </button>
                </div>

                <div className="p-1.5 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
    </header>
    {profilePopupOpen && <ProfilePopup onClose={() => setProfilePopupOpen(false)} />}
      </>
  );
};

export default Header;