import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
// Ensure clearErrors exists in your slice to reset toast states without wiping the whole slice
import { register, resetAuthSlice } from "../store/slices/authSlice"; 
import logo_with_title from "../assets/logo-with-title.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();
    
    // DEBUG: Changed from FormData to Object to match your Slice's JSON header
    const userData = {
      name,
      email,
      password
    };
    
    dispatch(register(userData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      // DEBUG: Ensure navigation happens BEFORE the state is reset
      navigate(`/otp-verification/${email}`);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, message, error, navigate, email]);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* --- LEFT PANEL: BRANDING --- */}
      <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-500 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="relative z-10 text-center max-w-md">
          <img 
            src={logo_with_title} 
            alt="ShelfSync" 
            className="w-56 mx-auto mb-10 brightness-0 invert" 
          />
          <h2 className="text-3xl font-serif text-white mb-6 leading-tight">
            Elevate your personal library management experience.
          </h2>
          <div className="h-1 w-12 bg-orange-500 mx-auto mb-10"></div>
          <p className="text-gray-400 text-sm tracking-wide mb-12 leading-relaxed">
            Join thousands of curators organizing the world's knowledge, one shelf at a time.
          </p>
          
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Membership</p>
            <Link 
              to="/login" 
              className="inline-block px-8 py-3 border border-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Access Account
            </Link>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md">
          <img src={logo_with_title} alt="Logo" className="w-32 mb-8 lg:hidden mx-auto" />

          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-serif text-gray-900 mb-2">Create Registry</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to initialize your account.</p>
          </header>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Barnes"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-black/20 hover:bg-gray-900 active:scale-[0.98] transition-all mt-6 disabled:bg-gray-300 disabled:shadow-none"
            >
              {loading ? "Authenticating..." : "Establish Account"}
            </button>
          </form>

          <footer className="mt-12 text-center lg:text-left">
            <p className="text-gray-400 text-xs">
              By registering, you agree to our <span className="text-gray-900 underline cursor-pointer">Terms of Service</span>.
            </p>
            <p className="mt-4 lg:hidden text-xs uppercase tracking-widest font-bold">
              <Link to="/login" className="text-orange-600">Sign In instead</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;