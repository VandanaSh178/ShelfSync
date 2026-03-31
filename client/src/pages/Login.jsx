import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, Loader2 } from "lucide-react"; // Install lucide-react for icons

import logo_with_title from "../assets/logo-with-title.png";
import { loginUser, resetAuthSlice } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simplified: Passing a plain object is safer for JSON APIs
    dispatch(loginUser({ email, password }));
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
    <div className="flex min-h-screen bg-white">
      {/* LEFT PANEL: BRANDING (Reordered for desktop flow) */}
      <div className="hidden w-1/2 bg-black text-white lg:flex flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="text-center relative z-10 max-w-md">
          <img
            src={logo_with_title}
            alt="Logo"
            className="mb-8 h-32 w-auto brightness-0 invert mx-auto transition-transform hover:scale-105 duration-500"
          />
          <h2 className="text-2xl font-serif mb-4">Elevate Your Workflow</h2>
          <p className="text-gray-400 mb-10 text-sm leading-relaxed uppercase tracking-widest">
            Join thousands of users managing their inventory with precision.
          </p>
          <Link
            to="/register"
            className="inline-block border border-white/30 text-white hover:bg-white hover:text-black py-4 px-10 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all duration-300 hover:shadow-2xl hover:shadow-white/10"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* RIGHT PANEL: FORM CONTAINER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={logo_with_title} alt="Logo" className="h-16 w-auto" />
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-serif text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 absolute -top-2.5 left-4 bg-white px-2 z-10">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 absolute -top-2.5 left-4 bg-white px-2 z-10">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/password/forgot" className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-wider">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 uppercase tracking-[0.2em] text-[11px] shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-8 lg:hidden">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-600 font-bold hover:underline">
                Register
              </Link>
            </p>
          </form>
          
          <footer className="mt-16 text-center text-gray-400 text-[10px] uppercase tracking-widest">
            © 2026 ShelfSync Systems. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;