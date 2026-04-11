import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  user: null,
  allUsers: [],
  error: null,
  message: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // REQUESTS
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    otpVerificationRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.message = action.payload.message;
    },
    otpVerificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.message = action.payload.message;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.message = "Logged out successfully";
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      // Do NOT set state.error = action.payload here 
      // if you don't want a toast to pop up every time a guest visits the site.
    },
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    updatePasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetAuthSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.isAuthenticated=false;
      state.user=null;
    },
    clearAllErrors: (state) => {
      state.error = null;
    },
    // In authSlice reducers
clearMessage: (state) => {
  state.message = null;
},
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  otpVerificationRequest,
  otpVerificationSuccess,
  otpVerificationFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFailure,
  resetAuthSlice,
  clearAllErrors,
  clearMessage
} = authSlice.actions;

////////////////////////////////////////////////////////
// 🚀 ASYNC THUNKS
////////////////////////////////////////////////////////

const BASE_URL = "http://localhost:4000/api/auth";

// 1. REGISTER
// Inside authSlice.js
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    
    // Ensure userData is a clean object { name, email, password }
    const { data } = await axios.post("http://localhost:4000/api/auth/register", userData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    dispatch(registerSuccess({ message: data.message }));
  } catch (error) {
    // This captures specific backend messages like "Too many attempts"
    const errorMessage = error.response?.data?.message || "Registration failed";
    dispatch(registerFailure(errorMessage));
  }
};

// 2. OTP VERIFICATION
// 2. OTP VERIFICATION
export const otpVerification = (otpData) => async (dispatch) => {
  try {
    dispatch(otpVerificationRequest());
    
    // ✅ FIX: Spread otpData or send it directly so the keys 
    // email and otp are at the top level of req.body
    const { data } = await axios.post(`${BASE_URL}/verify-otp`, otpData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    
    dispatch(otpVerificationSuccess({ user: data.user, message: data.message }));
  } catch (error) {
    dispatch(otpVerificationFailure(error.response?.data?.message || "OTP verification failed"));
  }
};

// 3. LOGIN
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`${BASE_URL}/login`, credentials, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(loginSuccess({ user: data.user, message: data.message }));
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
  }
};

// 4. LOGOUT
// Inside authSlice.js

// Inside authSlice.js

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());

    // ✅ FIX: Use axios.get to match your backend router.get
    // Ensure BASE_URL is "http://localhost:4000/api/auth"
    const { data } = await axios.get(`${BASE_URL}/logout`, { 
      withCredentials: true 
    });

    dispatch(logoutSuccess());
    dispatch(resetAuthSlice());

    // ✅ REDIRECT: Force the browser to the login page after state is cleared
    window.location.href = "/login";

  } catch (error) {
    // If it's still 404, check if your backend route is actually "/logout" 
    // or if it's something else like "/user/logout"
    const errorMessage = error.response?.data?.message || "Logout failed";
    dispatch(logoutFailure(errorMessage));
  }
};

// 5. GET USER DETAILS
export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest());
    const { data } = await axios.get("http://localhost:4000/api/auth/me", {
      withCredentials: true,
    });
    dispatch(getUserSuccess(data.user));
  } catch (error) {
    // ✅ ANY failure = not logged in, never block the app
    dispatch(getUserFailure());
  }
};

// 6. FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const { data } = await axios.post(`${BASE_URL}/password/forgot`, { email }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(forgotPasswordSuccess({ message: data.message }));
  } catch (error) {
    dispatch(forgotPasswordFailure(error.response?.data?.message || "Password reset request failed"));
  }
};

// 7. RESET PASSWORD
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const { data } = await axios.put(`${BASE_URL}/password/reset/${token}`, passwords, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(resetPasswordSuccess({ message: data.message }));
  } catch (error) {
    dispatch(resetPasswordFailure(error.response?.data?.message || "Password reset failed"));
  }
};

// 8. UPDATE PASSWORD
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const { data } = await axios.put(`${BASE_URL}/password/update`, passwords, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(updatePasswordSuccess({ message: data.message }));
  } catch (error) {
    dispatch(updatePasswordFailure(error.response?.data?.message || "Password update failed"));
  }
};

export default authSlice.reducer;