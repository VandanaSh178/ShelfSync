import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { Settings, User, Clock, ChevronDown } from "lucide-react"; 

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0"); 
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200/60 sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-sm">
      
      {/* LEFT SIDE: MODERN DIGITAL CLOCK */}
      <div className="flex items-center gap-4 group cursor-default">
        <div className="p-2.5 bg-black text-white rounded-xl shadow-lg group-hover:bg-orange-500 group-hover:rotate-6 transition-all duration-500">
           <Clock className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900 leading-none">
            {currentTime}
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1.5 font-bold">
            {currentDate}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: PROFESSIONAL IDENTITY */}
      <div className="flex items-center space-x-6">
        
        {/* LIBRARIAN LABEL */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900 uppercase tracking-tighter italic">
             {user?.name || "Anonymous Scholar"}
          </p>
          <div className="flex items-center justify-end gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-[9px] text-orange-500 font-bold uppercase tracking-[0.2em]">
              {user?.role === 'admin' ? 'Archive Admin' : 'Active Member'}
            </p>
          </div>
        </div>

        {/* ACTION GROUP */}
        <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
            {/* AVATAR SYSTEM */}
            <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-[#faf9f6] border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-orange-500 group-hover:shadow-orange-100 transition-all overflow-hidden">
                    {user?.avatar?.url ? (
                        <img src={user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    )}
                </div>
            </div>

            {/* SETTINGS TRIGGER */}
            <button 
                onClick={() => dispatch(toggleSettingPopup())}
                className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:shadow-sm transition-all active:scale-95 group"
                title="System Settings"
            >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;