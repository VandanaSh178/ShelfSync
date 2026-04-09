import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { updatePassword } from "../store/slices/authSlice";
import { X, User, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [tab, setTab] = useState("info"); // "info" | "password"
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    await dispatch(updatePassword(passwords));
    setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    onClose();
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black text-white">
          <h2 className="text-sm font-black uppercase tracking-widest">My Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6 bg-gray-50 border-b border-gray-100">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg mb-3">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-white text-2xl font-black">{initials}</span>
              </div>
            )}
          </div>
          <p className="text-lg font-black text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
            user?.role === "admin"
              ? "bg-purple-100 text-purple-600"
              : "bg-orange-100 text-orange-600"
          }`}>
            {user?.role}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab("info")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
              tab === "info"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Info
          </button>
          <button
            onClick={() => setTab("password")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
              tab === "password"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Password
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* Info Tab */}
          {tab === "info" && (
            <div className="space-y-4">
              {[
                { label: "Full Name", value: user?.name },
                { label: "Email Address", value: user?.email },
                { label: "Role", value: user?.role },
                { label: "Account Status", value: user?.accountVerified ? "Verified ✓" : "Unverified" },
                { label: "Member Since", value: new Date(user?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {label}
                  </label>
                  <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-semibold">
                    {value || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Password Tab */}
          {tab === "password" && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { label: "Current Password", key: "currentPassword", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                { label: "New Password", key: "newPassword", show: showNew, toggle: () => setShowNew(!showNew) },
                { label: "Confirm New Password", key: "confirmNewPassword", show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
              ].map(({ label, key, show, toggle }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={passwords[key]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;