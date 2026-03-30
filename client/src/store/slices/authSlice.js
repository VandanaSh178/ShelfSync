import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../services/api"; 

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
  initialState: initialState, // ✅ Fixed: Added colon and fixed syntax
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
      state.error = action.payload;
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
      state.user = null;
      state.error = null;
      state.message = null;
      state.isAuthenticated = false;
    },
  },
});

// ✅ Fixed: Exported names now match the reducer names exactly
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
  resetAuthSlice
} = authSlice.actions;

////////////////////////////////////////////////////////
// 🚀 ASYNC THUNKS
////////////////////////////////////////////////////////

// 2. REGISTER
export const register = (userData) => async (dispatch)=>{
  dispatch(registerRequest());
  await axios.post("/auth/register", userData,{
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => { dispatch(registerSuccess({ message: response.data.message })); })
  .catch((error) => {
    dispatch(registerFailure(error.response?.data?.message || "Registration failed"));
  });
}

// 3. OTP VERIFICATION
export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(otpVerificationRequest());
  await axios.post("/auth/otp-verify", { email, otp }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    dispatch(otpVerificationSuccess({ user: response.data.user, message: response.data.message }));
  })
  .catch((error) => {
    dispatch(otpVerificationFailure(error.response?.data?.message || "OTP verification failed"));
  });
};

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  await axios.post("/auth/login", credentials, {  
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    dispatch(loginSuccess({ user: response.data.user, message: response.data.message }));
  })
  .catch((error) => {
    dispatch(loginFailure(error.response?.data?.message || "Login failed"));
  });
};

export const logoutUser = () => async (dispatch) => {
  dispatch(logoutRequest());
  await axios.post("/auth/logout", {}, {  
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    dispatch(logoutSuccess());
    dispatch(resetAuthSlice()); 
  })
  .catch((error) => {
    dispatch(logoutFailure(error.response?.data?.message || "Logout failed"));
  });
};

export const getUser = () => async (dispatch) => {
  dispatch(getUserRequest());
  await axios.get("/auth/me", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    dispatch(getUserSuccess(response.data.user));
  })
  .catch((error) => {
    dispatch(getUserFailure(error.response?.data?.message || "Failed to fetch user data"));
  });
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotPasswordRequest());
  await axios.post("/auth/forgot-password", { email }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    dispatch(forgotPasswordSuccess({ message: response.data.message }));
  }) // ✅ Fixed: Added missing brace
  .catch((error) => {
    dispatch(forgotPasswordFailure(error.response?.data?.message || "Password reset failed"));
  }); // ✅ Fixed: Added missing parenthesis
};  

export const resetPassword = (token, newPassword) => async (dispatch) => {
  dispatch(resetPasswordRequest());
  await axios.post("/auth/reset-password", { token, newPassword }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    dispatch(resetPasswordSuccess({ message: response.data.message }));
  })
  .catch((error) => {
    dispatch(resetPasswordFailure(error.response?.data?.message || "Password reset failed"));
  });
};

export const updatePassword = (currentPassword, newPassword) => async (dispatch) => {
  dispatch(updatePasswordRequest());
  await axios.put("/auth/update-password", { currentPassword, newPassword }, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    dispatch(updatePasswordSuccess({ message: response.data.message }));
  })
  .catch((error) => {
    dispatch(updatePasswordFailure(error.response?.data?.message || "Password update failed"));
  });
};

export default authSlice.reducer;