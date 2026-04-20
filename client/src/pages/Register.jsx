import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen, User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { clearMessage, register, resetAuthSlice } from "../store/slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const hasNavigated = useRef(false);
  const emailRef = useRef("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated, user } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();
    if (loading) return;
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (message && !hasNavigated.current) {
      hasNavigated.current = true;
      toast.success(message);
      navigate(`/otp-verification/${emailRef.current}`);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
      hasNavigated.current = false;
    }
  }, [message, error]);

  // ✅ Fixed: was redirecting to "/" (landing page), now goes to correct dashboard
  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
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
              <span className="text-[10px] uppercase tracking-[0.3em] text-orange-400 font-bold">Library Management</span>
            </div>
            <h2 className="text-[46px] text-white leading-[1.1] mb-6 font-normal">
              Elevate your<br />
              personal<br />
              <span className="text-orange-400 italic">library.</span>
            </h2>
            <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs">
              Join thousands of curators organizing the world's knowledge, one shelf at a time.
            </p>
            <div className="flex gap-8 mt-10">
              {[["2.4k+", "Books tracked"], ["98%", "Return rate"], ["< 5min", "Setup"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-[22px] text-white font-normal">{v}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
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

            {/* Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full font-bold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Free forever
              </div>
              <h1 className="text-[36px] text-gray-900 leading-tight mb-2 font-normal">
                Create your<br />account
              </h1>
              <p className="text-gray-400 text-[13px]">Enter your details to get started.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Riya Sharma"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      emailRef.current = e.target.value;
                    }}
                    placeholder="you@example.com"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white text-[11px] uppercase tracking-[0.2em] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-300 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-[13px] text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                Sign in
              </Link>
            </p>

            <p className="text-center text-[11px] text-gray-300 mt-5 leading-relaxed">
              By registering, you agree to our{" "}
              <span className="text-gray-400 underline cursor-pointer">Terms of Service</span>.
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

export default Register;