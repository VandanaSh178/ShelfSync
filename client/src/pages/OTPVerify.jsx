import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen, KeyRound, Loader2 } from "lucide-react";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";

const OTPVerify = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const hasNavigated = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated, user } = useSelector((state) => state.auth);

  const handleOtpVerification = (e) => {
    e.preventDefault();
    if (loading) return;
    dispatch(otpVerification({ email, otp }));
  };

  useEffect(() => {
    // ✅ Navigate to correct dashboard after OTP success
    if (isAuthenticated && user && !hasNavigated.current) {
      hasNavigated.current = true;
      toast.success(message || "Verified successfully!");
      // ✅ Fixed: was navigating to "/" (landing), now goes to actual dashboard
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
      dispatch(resetAuthSlice());
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [error]);

  if (!email) {
    return <Link to="/register" />;
  }

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d]/92 via-[#1a0800]/82 to-[#0d0d0d]/75" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full bg-orange-600 opacity-[0.13] blur-[120px] pointer-events-none" />
        <div className="absolute top-[-40px] right-[-40px] w-[300px] h-[300px] rounded-full bg-amber-500 opacity-[0.07] blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`, backgroundSize: "60px 60px" }}
        />

        <div className="relative flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-[18px] tracking-tight font-semibold">ShelfSync</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-orange-500" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-orange-400 font-bold">Identity Verification</span>
            </div>
            <h2 className="text-[46px] text-white leading-[1.1] mb-6 font-normal">
              One step<br />
              away from<br />
              your <span className="text-orange-400 italic">library.</span>
            </h2>
            <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs">
              We sent a verification code to your email. Enter it to confirm your identity and access your account.
            </p>
          </div>

          <div className="border-l-2 border-orange-500/40 pl-4">
            <p className="text-gray-400 text-[13px] italic leading-relaxed">
              "The automation alone saved us hours every week."
            </p>
            <p className="text-[11px] text-gray-600 mt-1 uppercase tracking-wider">— School Librarian, Imphal</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 bg-[#fafaf8] flex flex-col">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-2 p-6 border-b border-gray-100">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-gray-900 text-[16px] font-semibold">ShelfSync</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-16 xl:px-20 py-12">
          <div className="max-w-sm w-full mx-auto lg:mx-0">

            {/* Back button */}
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-gray-700 font-bold mb-10 transition-colors"
            >
              ← Back to register
            </Link>

            {/* Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full font-bold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Verification required
              </div>
              <h1 className="text-[36px] text-gray-900 leading-tight mb-2 font-normal">
                Verify your<br />identity
              </h1>
              <p className="text-gray-400 text-[13px]">
                We sent a code to{" "}
                <span className="text-gray-700 font-semibold">{email}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleOtpVerification} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-3">
                  Enter 5-digit code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    maxLength="5"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="00000"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-4 text-[24px] text-center tracking-[0.5em] font-serif text-gray-900 placeholder-gray-200 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 5}
                className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[11px] uppercase tracking-[0.2em] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Confirm code"
                )}
              </button>
            </form>

            <p className="text-center text-[13px] text-gray-400 mt-7">
              Didn't receive a code?{" "}
              <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                Re-register
              </Link>
            </p>

          </div>
        </div>

        <div className="px-8 sm:px-14 lg:px-16 xl:px-20 py-5 border-t border-gray-100">
          <p className="text-[10px] text-gray-300 uppercase tracking-widest text-center lg:text-left">
            © 2026 ShelfSync Systems. All Rights Reserved.
          </p>
        </div>
      </div>

    </div>
  );
};

export default OTPVerify;