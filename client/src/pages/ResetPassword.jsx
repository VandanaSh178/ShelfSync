import React, { useEffect, useState } from "react"; // Fixed: removed 'use', added 'useEffect'
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Lock, CheckCircle2, Loader2 } from "lucide-react";

import logo_with_title from "../assets/logo-with-title.png";
import { resetPassword, resetAuthSlice } from "../store/slices/authSlice";

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    // Matching your slice: resetPassword(token, passwords)
    dispatch(resetPassword(token, { password, confirmPassword }));
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

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* LEFT SECTION: BRANDING */}
      <div className="hidden w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-12 rounded-tr-[80px] rounded-br-[80px] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="text-center relative z-10">
          <img src={logo_with_title} alt="Logo" className="mb-12 h-44 w-auto brightness-0 invert mx-auto" />
          <h3 className="text-2xl font-serif tracking-wide">Security First.</h3>
          <p className="text-gray-400 mt-4 uppercase tracking-[0.3em] text-[10px]">Secure your ShelfSync account</p>
        </div>
      </div>

      {/* RIGHT SECTION: FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-serif text-gray-900 mb-2">New Password</h1>
            <p className="text-gray-500 text-sm">Please choose a strong password you haven't used before.</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 absolute -top-2.5 left-4 bg-white px-2 z-10">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 absolute -top-2.5 left-4 bg-white px-2 z-10">
                Confirm Password
              </label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-5 rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 uppercase tracking-[0.2em] text-[11px] shadow-xl flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;