import React, { useEffect, useState } from "react";
import logo_with_title_white from "../assets/logo-with-title.png"; 
import logo_black from "../assets/logo-with-title-black.png";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { register, clearError, clearMessage } from "../store/slices/authSlice";
import { toast } from "react-toastify";
// Using lucide-react for professional, thin-stroke icons
import { BookOpen, ShieldCheck, Globe, ArrowRight } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate(`/otp-verification/${encodeURIComponent(email)}`);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error, message, navigate, email]);

  // Add this inside your OTPVerification component
useEffect(() => {
  if (otp.length === 5) {
    // Small delay for visual feedback so the user sees the 5th digit
    const timeout = setTimeout(() => {
      dispatch(otpVerification(decodeURIComponent(email), otp));
    }, 300);
    return () => clearTimeout(timeout);
  }
}, [otp, email, dispatch]);

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] text-[#1A1A1A]">
      
      {/* LEFT SIDE: THE LIBRARY AMBIANCE (Desktop Only) */}
      <div className="hidden lg:flex w-[40%] bg-[#121212] text-white flex-col justify-between p-16 relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="relative z-10">
          <img 
            src={logo_with_title_white} 
            alt="ShelfSync" 
            className="h-10 w-auto mb-20"
          />
          
          <div className="space-y-12">
            <h1 className="text-5xl font-serif leading-tight">
              Organizing the world’s <br />
              <span className="italic text-gray-400 font-light text-4xl">knowledge, one shelf at a time.</span>
            </h1>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <BookOpen className="w-6 h-6 mt-1 text-gray-400" />
                <div>
                  <h4 className="font-semibold text-lg">Smart Cataloging</h4>
                  <p className="text-gray-500 text-sm">Automated ISBN fetching and category sorting.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 mt-1 text-gray-400" />
                <div>
                  <h4 className="font-semibold text-lg">Circulation Control</h4>
                  <p className="text-gray-500 text-sm">Manage check-outs, returns, and late fees with ease.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs tracking-widest text-gray-600 uppercase">
          ShelfSync © 2026 // Premium Library Infrastructure
        </div>
      </div>

      {/* RIGHT SIDE: THE REGISTRATION FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md">
          
          <div className="mb-12">
            <div className="lg:hidden mb-8">
              <img src={logo_black} alt="logo" className="h-8 w-auto" />
            </div>
            <h2 className="text-4xl font-serif mb-3">Create an Account</h2>
            <p className="text-gray-500">Join the digital transformation of your local library.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-black">
                Librarian Name
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 focus:border-black outline-none transition-all placeholder:text-gray-300 text-lg" 
              />
            </div>

            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-black">
                Institutional Email
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@library.org"
                required
                className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 focus:border-black outline-none transition-all placeholder:text-gray-300 text-lg" 
              />
            </div>

            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-black">
                Access Password
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-200 focus:border-black outline-none transition-all placeholder:text-gray-300 text-lg" 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-[#121212] text-white py-5 rounded-none font-bold hover:bg-black transition-all flex items-center justify-center gap-3 disabled:bg-gray-300"
            >
              {loading ? "INITIALIZING..." : (
                <>
                  GET ACCESS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-sm text-gray-500">
            Already registered?{" "}
            <Link to="/login" className="text-black font-bold border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;