import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { Settings, User, Clock } from "lucide-react"; // Using Lucide for sharper look

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // FIXED LOGIC: minutes must use getMinutes(), not getHours()
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0"); // Changed getHours to getMinutes
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
    <header className="flex items-center justify-between bg-[#faf9f6] px-8 py-4 border-b border-gray-200/60 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      
      {/* Left Side: Modern Digital Clock */}
      <div className="flex items-center gap-4 group">
        <div className="p-2 bg-black text-white rounded-lg shadow-lg group-hover:bg-orange-500 transition-colors duration-500">
           <Clock className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900 leading-none">
            {currentTime}
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-medium">
            {currentDate}
          </p>
        </div>
      </div>

      {/* Right Side: Professional Identity */}
      <div className="flex items-center space-x-6">
        
        {/* Librarian Label */}
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900 uppercase tracking-tighter italic">
             {user?.name || "Library Guest"}
          </p>
          <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest text-right">
            System {user?.role || "Operator"}
          </p>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm hover:border-orange-200 transition-all cursor-pointer overflow-hidden">
                <User className="w-5 h-5 text-gray-400" />
            </div>

            {/* Settings Button */}
            <button 
                onClick={() => dispatch(toggleSettingPopup())}
                className="p-2.5 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-black hover:shadow-md hover:-rotate-12 transition-all active:scale-90"
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;