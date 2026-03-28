import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword, clearError, clearMessage } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import logo_with_title_white from "../assets/logo-with-title.png";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state) => state.auth);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    // Sending both password and confirmPassword as your backend controller expects
    dispatch(resetPassword(token, passwords));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      // Redirect to login after successful reset
      navigate("/login");
    }
  }, [error, message, dispatch, navigate]);

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      
      {/* LEFT SIDE: SECURITY BRANDING */}
      <div className="hidden lg:flex w-[45%] bg-[#0a0a0a] text-white flex-col justify-between p-20 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]"></div>

        <div className="relative z-10">
          <img src={logo_with_title_white} alt="ShelfSync" className="h-12 w-auto mb-24" />
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full border border-orange-500/30 text-[10px] uppercase tracking-[0.3em] text-orange-400 bg-orange-400/5">
              Secure Protocol
            </span>
            <h1 className="text-6xl font-serif leading-[1.1]">
              Redefine <br />
              <span className="text-orange-400 italic">Security.</span>
            </h1>
            <p className="text-gray-400 max-w-sm font-light leading-relaxed pt-4">
              Your recovery token has been validated. Please establish a new administrative password to regain system access.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-[10px] tracking-widest text-gray-600 uppercase">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          Encrypted Session
        </div>
      </div>

      {/* RIGHT SIDE: RESET FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-12">
          
          <div className="space-y-4">
             <h2 className="text-5xl font-serif tracking-tighter">New Password</h2>
             <p className="text-gray-400 font-medium">Create a strong, unique password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* New Password */}
              <div className="relative group">
                <Lock className="absolute left-0 top-4 w-4 h-4 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={passwords.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-4 pl-8 outline-none focus:border-orange-500 transition-all font-light"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <Lock className="absolute left-0 top-4 w-4 h-4 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-4 pl-8 outline-none focus:border-orange-500 transition-all font-light"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full relative h-16 bg-[#0a0a0a] text-white overflow-hidden transition-all active:scale-95 disabled:bg-gray-200"
            >
              <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-500 ease-out group-hover:w-full"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm">
                {loading ? "UPDATING..." : (
                  <>
                    Update Password <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ResetPassword;