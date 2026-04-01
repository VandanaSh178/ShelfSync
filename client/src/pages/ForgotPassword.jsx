import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react"; 

import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import logo_with_title from "../assets/logo-with-title.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      // We don't necessarily want to reset the slice here 
      // if we want to show the "Success" UI based on the message.
    }
  }, [dispatch, error, message]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* LEFT SECTION: BRANDING (Matches Login/Reset) */}
      <div className="hidden w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-12 rounded-tr-[80px] rounded-br-[80px] relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="text-center relative z-10">
          <img src={logo_with_title} alt="Logo" className="mb-12 h-44 w-auto brightness-0 invert mx-auto" />
          <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-lg border border-white/10">
             <KeyRound className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-2xl font-serif tracking-wide">Account Recovery</h3>
          <p className="text-gray-400 mt-4 uppercase tracking-[0.3em] text-[10px]">Back to business in no time</p>
        </div>
      </div>

      {/* RIGHT SECTION: FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-sm w-full">
          
          {/* Mobile Logo Only */}
          <div className="flex justify-center mb-8 md:hidden">
            <img src={logo_with_title} alt="Logo" className="h-16 w-auto" />
          </div>

          {message ? (
            /* SUCCESS STATE UI */
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-orange-500" />
              </div>
              <h1 className="text-3xl font-serif text-gray-900 mb-4">Check Inbox</h1>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed">
                We've sent a recovery link to <br/>
                <span className="font-bold text-gray-900">{email}</span>
              </p>
              <Link
                to="/login"
                onClick={() => dispatch(resetAuthSlice())}
                className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Sign In
              </Link>
            </div>
          ) : (
            /* FORM STATE UI */
            <>
              <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-serif text-gray-900 mb-2">Password Reset</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Lost your way? Enter your email address and we'll help you get back in.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-8">
                <div className="relative">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 absolute -top-2.5 left-4 bg-white px-2 z-10">
                    Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
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
                      Sending Link...
                    </>
                  ) : (
                    "Send Recovery Link"
                  )}
                </button>
              </form>

              <div className="mt-10 text-center md:text-left">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;