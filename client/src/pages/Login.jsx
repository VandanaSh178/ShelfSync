import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuth } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Lock, Mail, Zap } from "lucide-react";
import logo_white from "../assets/logo-with-title.png";
import logo_black from "../assets/logo-with-title-black.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuth());
    }

    if (message) {
      toast.success(message);
      dispatch(resetAuth());
    }

    if (isAuthenticated) {
      navigate("/");
    }
  }, [error, message, isAuthenticated, dispatch, navigate]);

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      
      {/* LEFT SIDE: BRAND IMPACT */}
      <div className="hidden lg:flex w-[45%] bg-[#0a0a0a] text-white flex-col justify-between p-20 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-[120px]"></div>

        <div className="relative z-10">
          <img src={logo_white} alt="ShelfSync" className="h-12 w-auto mb-24" />
          
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-[10px] uppercase tracking-[0.3em] bg-white/5 backdrop-blur-sm">
              Librarian Portal
            </span>
            <h1 className="text-7xl font-serif leading-[1.1] tracking-tight">
              Welcome <br />
              <span className="text-orange-400 italic">Back.</span>
            </h1>
            <p className="text-gray-400 max-w-sm font-light leading-relaxed pt-4">
              Access your collection, manage logistics, and synchronize your library's heartbeat.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] tracking-widest text-gray-500 uppercase">
          <div className="w-8 h-[1px] bg-gray-800"></div>
          ShelfSync // Management System
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-12">
          
          <div className="space-y-4">
             <img src={logo_black} alt="logo" className="h-8 w-auto lg:hidden mb-8" />
             <h2 className="text-5xl font-serif tracking-tighter">Sign In</h2>
             <p className="text-gray-400 font-medium">Please enter your administrative credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative group">
                <Mail className="absolute left-0 top-4 w-4 h-4 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Institutional Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-4 pl-8 outline-none focus:border-orange-500 transition-all font-light"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute left-0 top-4 w-4 h-4 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-4 pl-8 outline-none focus:border-orange-500 transition-all font-light"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs uppercase tracking-widest">
                <button 
                  type="button"
                  onClick={() => navigate("/password/forgot")}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  Forgot Key?
                </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full relative h-16 bg-[#0a0a0a] text-white overflow-hidden transition-all active:scale-95 disabled:bg-gray-200"
            >
              <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-500 ease-out group-hover:w-full"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm">
                {loading ? "Authenticating..." : (
                  <>
                    Enter System <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 uppercase tracking-widest leading-loose">
            New to the staff? <br />
            <Link to="/register" className="text-black font-bold hover:text-orange-500 transition-colors underline underline-offset-4">
                Request Access
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;