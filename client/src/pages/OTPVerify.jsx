import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import logo_with_title from "../assets/logo-with-title.png";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState(""); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleOtpVerification = (e) => {
    e.preventDefault();
    const otpData = {
      email: email,
      otp: otp
    };
    dispatch(otpVerification(otpData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/");
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, message, error, navigate]);

  // Handle authenticated users trying to access OTP
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FDFDFD]">
      {/* LEFT PANEL: FORM CONTAINER */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        <Link
          to={"/register"}
          className="border-2 border-black rounded-3xl font-bold w-32 py-2 px-4 absolute top-10 left-10 hover:bg-black hover:text-white transition duration-300 text-center text-xs uppercase tracking-widest"
        >
          Back
        </Link>
        
        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-12">
            <img src={logo_with_title} alt="Logo" className="h-20 w-auto lg:hidden" />
          </div>
          
          <h1 className="text-4xl font-serif text-center mb-6">Verify Identity</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">
            We have sent a code to <span className="font-bold text-black">{email}</span>.
          </p>

          <form onSubmit={handleOtpVerification} className="space-y-6">
            <div>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="00000"
                className="w-full border border-gray-200 rounded-2xl py-5 px-4 text-center text-3xl tracking-[0.5em] font-serif focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all shadow-sm"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold py-5 rounded-2xl hover:bg-gray-900 transition duration-300 uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-black/10 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Confirm Code"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL: BRANDING */}
      <div className="hidden w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-12 rounded-tl-[80px] rounded-bl-[80px] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-orange-500 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="text-center relative z-10">
          <img src={logo_with_title} alt="Logo" className="mb-12 h-44 w-auto brightness-0 invert mx-auto"/>
          <p className="text-gray-400 mb-8 uppercase tracking-widest text-[10px] font-bold">New to our platform?</p>
          <Link 
            to="/register" 
            className="inline-block border-2 border-white/20 text-white hover:bg-white hover:text-black py-3 px-8 rounded-full font-bold uppercase tracking-widest text-[10px] transition duration-300"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTP;