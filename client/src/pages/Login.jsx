import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BookOpen, Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginUser, clearAllErrors, clearMessage } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  // ✅ Handle login and redirect in one place
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    const data = await dispatch(loginUser({ email, password }));
    if (data?.user) {
      toast.success(data.message || "Logged in successfully!");
      window.location.href = data.user.role === "admin" ? "/admin/dashboard" : "/dashboard";
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
    }
  }, [error]);

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d]/92 via-[#1a0800]/82 to-[#0d0d0d]/75" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full bg-orange-600 opacity-[0.13] blur-[120px] pointer-events-none" />
        <div className="absolute top-[-40px] right-[-40px] w-[300px] h-[300px] rounded-full bg-amber-500 opacity-[0.07] blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="relative flex flex-col h-full p-12">
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
              Every great<br />library starts<br />with <span className="text-orange-400 italic">order.</span>
            </h2>
            <p className="text-gray-400 text-[14px] leading-relaxed max-w-xs">
              ShelfSync keeps your books, members, and reminders running like clockwork — so you never miss a return.
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
        <div className="lg:hidden flex items-center gap-2 p-6 border-b border-gray-100">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-gray-900 text-[16px] font-semibold">ShelfSync</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-16 xl:px-20 py-12">
          <div className="max-w-sm w-full mx-auto lg:mx-0">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full font-bold mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Welcome back
              </div>
              <h1 className="text-[36px] text-gray-900 leading-tight mb-2 font-normal">
                Sign in to<br />your library
              </h1>
              <p className="text-gray-400 text-[13px]">Enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link to="/password/forgot"
                  className="text-[11px] text-orange-500 hover:text-orange-600 font-bold uppercase tracking-wider transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading}
                className="group w-full bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white text-[11px] uppercase tracking-[0.2em] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 mt-2">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
                ) : (
                  <>Sign in<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-300 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <p className="text-center text-[13px] text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                Create one free
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

export default Login;