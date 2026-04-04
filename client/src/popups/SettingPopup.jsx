import React, { useState } from "react"; // ✅ Added useState
import { useDispatch, useSelector } from "react-redux"; // ✅ Added Redux hooks
import closeIcon from "../assets/close-square.png";
import { KeyIcon, Lock, ShieldCheck } from "lucide-react"; // ✅ Fixed Case Sensitivity
import { toggleSettingPopup } from "../store/slices/popUpSlice"; 
import { updatePassword } from "../store/slices/authSlice"; 

const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  
  // Make sure your store has an 'auth' slice
  const { loading } = useSelector((state) => state.auth || {});

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    // Sending as an object for JSON request
    dispatch(updatePassword({ currentPassword, newPassword, confirmNewPassword }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-5 flex items-center justify-center z-[100]">
      <div className="w-full bg-white rounded-3xl shadow-2xl md:w-[450px] overflow-hidden border border-gray-100">
        <div className="p-8">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Security Settings</h3>
            </div>
            <button 
              onClick={() => dispatch(toggleSettingPopup())}
              className="hover:rotate-90 transition-transform duration-300"
            >
              <img src={closeIcon} alt="close" className="w-6 h-6" />
            </button>
          </header>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
               <input 
                type="password" 
                placeholder="Current Password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
               />
            </div>

            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
               <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
               />
            </div>

            <div className="relative group">
               <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
               <input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmNewPassword} 
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
               />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg shadow-black/10 active:scale-[0.98] disabled:bg-gray-300"
            >
              {loading ? "Processing..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;