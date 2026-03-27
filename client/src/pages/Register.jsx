import React, { useEffect, useState } from "react";
import logo_with_title_white from "../assets/logo-with-title.png"; 
import logo from "../assets/logo-with-title-black.png";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { register, clearError, clearMessage } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate(`/otp-verification/${encodeURIComponent(email)}`);
      dispatch(clearMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error, message, navigate, email]);

  if (isAuthenticated) return <Navigate to="/" />;

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
          <h1 className="text-4xl font-light tracking-widest mb-4">SHELF SYNC</h1>
          <p className="text-gray-400 mb-12 max-w-sm mx-auto">
            Manage your inventory with precision and elegance.
          </p>
          <Link 
            to="/login"
            className="border-2 rounded-full font-bold border-white py-3 px-12 hover:bg-white hover:text-black transition-all duration-300"
          >
            SIGN IN
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: THE FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        {/* All elements must be inside this wrapper div to stay centered */}
        <div className="max-w-sm w-full">
          
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5 mb-4">
            <h3 className="font-medium text-4xl uppercase tracking-tighter">Sign Up</h3>
            <img src={logo} alt="logo" className="h-auto w-20 object-contain" />
          </div>

          <p className="text-gray-500 text-center mb-10">Please provide your information to sign up.</p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-black rounded-md focus:ring-1 focus:ring-black outline-none transition-all" 
              />
            </div>

            <div>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-black rounded-md focus:ring-1 focus:ring-black outline-none transition-all" 
              />
            </div>

            <div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-black rounded-md focus:ring-1 focus:ring-black outline-none transition-all" 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-2 uppercase tracking-widest"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Mobile Footer */}
          <p className="mt-8 text-center text-sm text-gray-600 md:hidden">
            Already have an account? <Link to="/login" className="font-bold text-black underline">Sign In</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;