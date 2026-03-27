import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Hours/Minutes/AM-PM Logic
      const hours = now.getHours() % 12 || 12; // Fixed 'hourse' typo
      const minutes = now.getHours().toString().padStart(2, "0"); // Fixed logic to get minutes
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      
      // Fixed template literal syntax (use backticks and ${})
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" }; // Fixed 'dat' to 'day'
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 border-b border-gray-200 shadow-sm">
      {/* Left: Date & Time */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-gray-800">{currentTime}</h1>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{currentDate}</p>
      </div>

      {/* Right: User Info & Settings */}
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">{user?.name || "Guest"}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>

        {/* User Profile Circle */}
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
          <img src={userIcon} alt="user" className="w-6 h-6 object-contain" />
        </div>

        {/* Settings Toggle */}
        <button 
          onClick={() => dispatch(toggleSettingPopup())}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <img src={settingIcon} alt="settings" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;