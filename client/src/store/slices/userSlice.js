import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Example: Admin fetching all registered members
    getUsersRequest: (state) => {
      state.loading = true;
    },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      state.allUsers = action.payload;
    },
    getUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// 1. Named exports for your components/thunks
export const { getUsersRequest, getUsersSuccess, getUsersFailure } = userSlice.actions;

// ❌ THE MISSING PIECE: The store needs this to manage the state
export default userSlice.reducer;