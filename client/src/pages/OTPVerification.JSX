import React, { useEffect, useState } from "react";
import logo from "../assets/logo-with-title-black.png";
import logo_with_title_white from "../assets/logo-with-title.png";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, clearError, clearMessage } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      // On success, we usually send them home or to login
      navigate("/"); 
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    // If they are already authenticated, send them home
    if (isAuthenticated) {
      navigate("/");
    }
  }, [dispatch, error, message, navigate, isAuthenticated]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      
      {/* LEFT SIDE: THE BIG BLACK BOX */}
      <div className="hidden md:flex w-1/2 bg-black text-white flex-col items-center justify-center p-12 rounded-tr-[100px] rounded-br-[100px] shadow-2xl">
        <div className="text-center">
          <img 
            src={logo_with_title_white} 
            alt="logo" 
            className="h-56 w-auto object-contain mb-8"
          />
          <h1 className="text-4xl font-light tracking-widest mb-4 uppercase">Verify Identity</h1>
          <p className="text-gray-400 mb-12 max-w-sm mx-auto">
            A one-time password has been sent to <br/>
            <span className="text-white font-mono">{email}</span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: THE FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-sm w-full text-center">
          
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5 mb-4">
            <h3 className="font-medium text-4xl uppercase tracking-tighter">Enter OTP</h3>
            <img src={logo} alt="logo" className="h-auto w-20 object-contain" />
          </div>

          <p className="text-gray-500 mb-10 text-sm">Please enter the 6-digit code sent to your email.</p>
          
          <form onSubmit={handleOtpVerification} className="space-y-6">
            <div>
              <input 
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="0 0 0 0 0 0"
                required
                className="w-full px-4 py-4 border-2 border-black rounded-md text-center text-2xl tracking-[1em] font-bold focus:ring-1 focus:ring-black outline-none transition-all placeholder:tracking-normal placeholder:font-normal" 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-md font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-2 uppercase tracking-widest"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Didn't receive a code? <button className="text-black font-bold underline hover:no-underline">Resend</button>
          </p>
          
          <Link to="/register" className="mt-4 inline-block text-xs text-gray-400 hover:text-black transition-colors">
            Back to Registration
          </Link>
        </div>
      </div>

    </div>
  );
};

export default OTP;