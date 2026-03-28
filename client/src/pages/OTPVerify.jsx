import React, { useEffect, useState } from "react";
import logo_with_title_white from "../assets/logo-with-title.png"; 
import logo_black from "../assets/logo-with-title-black.png";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, clearError, clearMessage } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { ArrowRight, ShieldCheck } from "lucide-react";

const OTPVerification = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleOtpVerification = (e) => {
    e.preventDefault();
    // Ensuring we send the email and the 5-digit OTP
    dispatch(otpVerification(decodeURIComponent(email), otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/"); 
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (isAuthenticated) {
      navigate("/");
    }
  }, [dispatch, error, message, navigate, isAuthenticated]);

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      
      {/* LEFT SIDE: EDITORIAL STYLE */}
      <div className="hidden lg:flex w-[45%] bg-[#0a0a0a] text-white flex-col justify-between p-20 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-[120px]"></div>

        <div className="relative z-10">
          <img src={logo_with_title_white} alt="ShelfSync" className="h-12 w-auto mb-24" />
          
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.3em] bg-white/5 backdrop-blur-sm">
              Security Protocol
            </span>
            <h1 className="text-6xl font-serif leading-[1.1] tracking-tight">
              Verify your <br />
              <span className="text-orange-400 italic">Access.</span>
            </h1>
            <p className="text-gray-400 max-w-sm font-light leading-relaxed pt-4">
              A secure 5-digit code has been dispatched to your institutional inbox: <br/>
              <span className="text-white font-medium break-all">{decodeURIComponent(email)}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 text-[10px] tracking-widest text-gray-500 uppercase">
          ShelfSync // Two-Factor Authentication
        </div>
      </div>

      {/* RIGHT SIDE: THE INPUT */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-12 text-center lg:text-left">
          
          <div className="space-y-4">
             <img src={logo_black} alt="logo" className="h-8 w-auto mx-auto lg:mx-0 lg:hidden mb-8" />
             <h2 className="text-5xl font-serif tracking-tighter">Enter Code</h2>
             <p className="text-gray-400 font-medium">Please enter the 5-digit verification key.</p>
          </div>

          <form onSubmit={handleOtpVerification} className="space-y-10">
            <div className="relative">
              <input 
                type="text"
                maxLength="5" // Changed to 5
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                placeholder="• • • • •"
                required
                className="w-full bg-transparent border-b-2 border-gray-200 focus:border-orange-500 outline-none transition-all text-center text-5xl tracking-[0.5em] font-light py-4 placeholder:text-gray-200" 
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 5}
              className="group w-full relative h-16 bg-[#0a0a0a] text-white overflow-hidden transition-all active:scale-95 disabled:bg-gray-200"
            >
              <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-500 ease-out group-hover:w-full"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm">
                {loading ? "Verifying..." : (
                  <>
                    Confirm Identity <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.2em] text-gray-400">
            <p>
              No code? <button className="text-black font-bold hover:text-orange-500 transition-colors">Request Resend</button>
            </p>
            <Link to="/register" className="hover:text-black transition-colors">
              ← Return to Registration
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OTPVerification;