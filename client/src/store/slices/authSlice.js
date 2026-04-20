import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  initializing: true, // FIX: guards routes until getUser() resolves
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
      state.initializing = false; // FIX: unblock route guards
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFailure: (state) => {
      state.loading = false;
      state.initializing = false; // FIX: unblock route guards even on failure
      state.isAuthenticated = false;
      state.user = null;
      // Intentionally NOT setting state.error here to avoid
      // spurious toast popups when a guest visits the site.
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

    // FIX: Only clears transient status flags — never touches isAuthenticated or user.
    // Previously this wiped auth state, silently logging users out on any error.
    resetAuthSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },

    // Use this only for actual sign-out (e.g. after logoutSuccess)
    clearAuth: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.isAuthenticated = false;
      state.user = null;
    },

    clearAllErrors: (state) => {
      state.error = null;
    },

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
  clearAuth,
  clearAllErrors,
  clearMessage,
} = authSlice.actions;

////////////////////////////////////////////////////////
// ASYNC THUNKS
////////////////////////////////////////////////////////

const BASE_URL = "https://shelfsync-api.onrender.com/api/auth";

// 1. REGISTER
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post(
      `${BASE_URL}/register`,
      userData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(registerSuccess({ message: data.message }));
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Registration failed";
    dispatch(registerFailure(errorMessage));
  }
};

// 2. OTP VERIFICATION
export const otpVerification = (otpData) => async (dispatch) => {
  try {
    dispatch(otpVerificationRequest());
    const { data } = await axios.post(`${BASE_URL}/verify-otp`, otpData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(
      otpVerificationSuccess({ user: data.user, message: data.message })
    );
  } catch (error) {
    dispatch(
      otpVerificationFailure(
        error.response?.data?.message || "OTP verification failed"
      )
    );
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
    return data;
  } catch (error) {
    dispatch(
      loginFailure(error.response?.data?.message || "Login failed")
    );
  }
};

// 4. LOGOUT
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
    // FIX: removed redundant dispatch(resetAuthSlice()) — logoutSuccess
    // already sets user=null and isAuthenticated=false
    dispatch(logoutSuccess());
    window.location.href = "/login";
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Logout failed";
    dispatch(logoutFailure(errorMessage));
  }
};

// 5. GET USER DETAILS
export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest());
    const { data } = await axios.get(`${BASE_URL}/me`, {
      withCredentials: true,
    });
    dispatch(getUserSuccess(data.user));
  } catch (error) {
    // Any failure = not logged in; never block the app
    dispatch(getUserFailure());
  }
};

// 6. FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const { data } = await axios.post(
      `${BASE_URL}/password/forgot`,
      { email },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(forgotPasswordSuccess({ message: data.message }));
  } catch (error) {
    dispatch(
      forgotPasswordFailure(
        error.response?.data?.message || "Password reset request failed"
      )
    );
  }
};

// 7. RESET PASSWORD
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const { data } = await axios.put(
      `${BASE_URL}/password/reset/${token}`,
      passwords,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(resetPasswordSuccess({ message: data.message }));
  } catch (error) {
    dispatch(
      resetPasswordFailure(
        error.response?.data?.message || "Password reset failed"
      )
    );
  }
};

// 8. UPDATE PASSWORD
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const { data } = await axios.put(
      `${BASE_URL}/password/update`,
      passwords,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(updatePasswordSuccess({ message: data.message }));
  } catch (error) {
    dispatch(
      updatePasswordFailure(
        error.response?.data?.message || "Password update failed"
      )
    );
  }
};

export default authSlice.reducer;