import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { KeyIcon, UserPlus, Mail, Lock, Image as ImageIcon } from "lucide-react"; 
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import placeholder from "../assets/placeholder.jpg"; // Default avatar image

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  // Ensure 'users' matches the key in your store.js
  const { loading } = useSelector((state) => state.users || {});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(file);
      };
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    dispatch(addNewAdmin(formData));
  };

  return (
    // Fixed: Changed h1 to div and 'insert-0' to 'inset-0'
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-5 flex items-center justify-center z-[100]">
      <div className="w-full bg-white rounded-3xl shadow-2xl md:w-[450px] overflow-hidden border border-gray-100">
        <div className="p-8">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                <KeyIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Add New Admin</h3>
            </div>
            {/* Fixed: Added () to call the dispatch action */}
            <button 
              onClick={() => dispatch(toggleAddNewAdminPopup())}
              className="hover:rotate-90 transition-transform duration-300"
            >
              <img src={closeIcon} alt="close" className="w-6 h-6" />
            </button>
          </header>

          <form onSubmit={handleAddNewAdmin} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 mb-2">
                <img 
                  src={avatarPreview || placeholder} // Default avatar image
                  className="w-full h-full rounded-2xl object-cover border-2 border-orange-100 shadow-inner" 
                  alt="Preview" 
                />
                <label className="absolute bottom-[-10px] right-[-10px] bg-black text-white p-2 rounded-xl cursor-pointer hover:bg-orange-600 transition-colors shadow-lg">
                  <ImageIcon className="w-4 h-4" />
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Profile Picture</p>
            </div>

            {/* Form Fields */}
            <div className="relative group">
               <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
               <input 
                type="text" placeholder="Full Name" value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
               />
            </div>

            <div className="relative group">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
               <input 
                type="email" placeholder="Email Address" value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
               />
            </div>

            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
               <input 
                type="password" placeholder="Password" value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                required
               />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg shadow-black/10 active:scale-[0.98] disabled:bg-gray-300"
            >
              {loading ? "Authenticating..." : "Deploy Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewAdmin;