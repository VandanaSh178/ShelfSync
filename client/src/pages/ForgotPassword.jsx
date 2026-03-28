import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearError, clearMessage } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, SendHorizontal } from "lucide-react";
import logo_with_title_white from "../assets/logo-with-title.png";
import logo_black from "../assets/logo-with-title-black.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      // Optional: Redirect to login after a delay so they can check email
    }
  }, [error, message, dispatch]);

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      
      {/* LEFT SIDE: THEMATIC SIDEBAR */}
      <div className="hidden lg:flex w-[45%] bg-[#0a0a0a] text-white flex-col justify-between p-20 relative overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          <img src={logo_with_title_white} alt="ShelfSync" className="h-12 w-auto mb-24" />
          <div className="space-y-6">
            <h1 className="text-6xl font-serif leading-[1.1]">
              Account <br />
              <span className="text-orange-400 italic">Recovery.</span>
            </h1>
            <p className="text-gray-400 max-w-sm font-light leading-relaxed pt-4">
              Enter your registered email address and we'll send a secure link to reset your system access keys.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-[10px] tracking-[0.3em] text-gray-500 uppercase">
          Security Protocol // v3.0
        </div>
      </div>

      {/* RIGHT SIDE: RECOVERY FORM */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-12">
          
          <div className="space-y-4">
             <button 
               onClick={() => navigate("/login")}
               className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-8"
             >
               <ArrowLeft className="w-4 h-4" /> Back to Login
             </button>
             <h2 className="text-5xl font-serif tracking-tighter">Recover Access</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="relative group">
              <Mail className="absolute left-0 top-4 w-4 h-4 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="email"
                placeholder="Institutional Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-200 py-4 pl-8 outline-none focus:border-orange-500 transition-all font-light"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full relative h-16 bg-[#0a0a0a] text-white overflow-hidden transition-all active:scale-95 disabled:bg-gray-200"
            >
              <div className="absolute inset-0 w-0 bg-orange-500 transition-all duration-500 ease-out group-hover:w-full"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-sm">
                {loading ? "SENDING..." : (
                  <>
                    Send Reset Link <SendHorizontal className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-loose uppercase tracking-widest text-center">
              Locked out? Contact the <br />
              <span className="text-black font-bold">System Administrator</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;