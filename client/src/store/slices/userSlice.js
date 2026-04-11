import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { toggleAddNewAdminPopup } from "./popUpSlice";

const userSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    getUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.allUsers = action.payload;
    },
    getUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNewAdminRequest: (state) => {
      state.loading = true;
    },
    addNewAdminSuccess: (state, action) => {
      state.loading = false;
      state.allUsers.push(action.payload);
    },
    addNewAdminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  getUsersRequest, getUsersSuccess, getUsersFailure, 
  addNewAdminRequest, addNewAdminSuccess, addNewAdminFailure 
} = userSlice.actions;

// --- Thunks ---

export const getUsers = () => async (dispatch) => {
  dispatch(getUsersRequest());
  try {
    const { data } = await axios.get("http://localhost:4000/api/users/", { 
      withCredentials: true 
    });
    dispatch(getUsersSuccess(data.users));
  } catch (error) {
    // 🔥 Safety Check: If server is down, error.response is undefined
    const message = error.response?.data?.message || "Internal Server Error or Network Issue";
    dispatch(getUsersFailure(message));
  }
};

export const addNewAdmin = (formData) => async (dispatch) => {
  dispatch(addNewAdminRequest());
  try {
    const { data } = await axios.post(
      "http://localhost:4000/api/users/admin", // matched to your backend router
      formData,
      { 
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" } // For avatar uploads
      }
    );
    dispatch(addNewAdminSuccess(data.user));
    toast.success(data.message || "Admin Added!");
    dispatch(toggleAddNewAdminPopup()); // Close the popup after success
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add Admin";
    dispatch(addNewAdminFailure(message));
    toast.error(message);
  }
};

export default userSlice.reducer;