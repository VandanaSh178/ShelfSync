import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  loading: false,
  user: null,
  error: null,
  message: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // 🔹 Reset state (only error/message)
    resetAuth: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },

    // 🔹 Register
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 OTP
    otpVerificationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    otpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    otpVerificationFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Login
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
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

    // 🔹 Logout
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.message = action.payload?.message;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔹 Get User
    getUserRequest: (state) => {
      state.loading = true;
      state.error=null;
      state.message=null;
    },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailure: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
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

    // 🔹 Clear helpers
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const {
  resetAuth,
  registerRequest, registerSuccess, registerFailure,
  otpVerificationRequest, otpVerificationSuccess, otpVerificationFailure,
  loginRequest, loginSuccess, loginFailure,
  logoutRequest, logoutSuccess, logoutFailure,
  getUserRequest, getUserSuccess, getUserFailure,
  clearError, clearMessage,
  forgotPasswordRequest,
forgotPasswordSuccess,
forgotPasswordFailure,
resetPasswordRequest,
resetPasswordSuccess,
resetPasswordFailure,
updatePasswordRequest,
updatePasswordSuccess,
updatePasswordFailure,
} = authSlice.actions;

// 🔥 CONFIG
const config = {
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};

////////////////////////////////////////////////////////
// 🚀 THUNKS
////////////////////////////////////////////////////////

// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post("/api/auth/register", userData, config);
    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFailure(error.response?.data?.message || "Registration failed"));
  }
};

// OTP

export const otpVerification = (email, otp) => async (dispatch) => {
  try {
    dispatch(otpVerificationRequest());
    
    // Change "/api/auth/otp-verification" TO "/api/auth/verify-otp"
    const { data } = await axios.post(
      "/api/auth/verify-otp", 
      { email, otp }, 
      config
    );

    dispatch(otpVerificationSuccess(data));
  } catch (error) {
    dispatch(
      otpVerificationFailure(
        error.response?.data?.message || "OTP verification failed"
      )
    );
  }
};

// Login
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post("/api/auth/login", credentials, config);
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
  }
};

// Logout
export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    const { data } = await axios.get("/api/auth/logout", config);
    dispatch(logoutSuccess(data));
  } catch (error) {
    dispatch(logoutFailure(error.response?.data?.message || "Logout failed"));
  }
};

// Get Logged-in User
export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest());
    const { data } = await axios.get("/api/auth/me", config);
    dispatch(getUserSuccess(data));
  } catch (error) {
    dispatch(getUserFailure());
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());

    const { data } = await axios.post(
      "/api/auth/password/forgot",
      { email },
      config
    );

    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    dispatch(
      forgotPasswordFailure(
        error.response?.data?.message || "Failed to send reset email"
      )
    );
  }
};

export const resetPassword = (token, passwordData) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());

    // passwordData should be { password, confirmPassword }
    const { data } = await axios.put(
      `/api/auth/password/reset/${token}`,
      passwordData, 
      config
    );

    dispatch(resetPasswordSuccess(data));
  } catch (error) {
    dispatch(resetPasswordFailure(error.response?.data?.message || "Password reset failed"));
  }
};

export const updatePassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());

    const { data } = await axios.put(
      "/api/auth/password/update",
      passwordData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    dispatch(updatePasswordSuccess(data));
  } catch (error) {
    dispatch(
      updatePasswordFailure(
        error.response?.data?.message || "Password update failed"
      )
    );
  }
};

export default authSlice.reducer;