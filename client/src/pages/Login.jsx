import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuth } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-[350px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="text-sm mt-4 text-blue-500 cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
};

export default Login;