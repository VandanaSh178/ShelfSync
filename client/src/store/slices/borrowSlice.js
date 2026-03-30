import { createSlice } from "@reduxjs/toolkit";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    myBorrows: [],
    allLoans: [], // For Admin view
    loading: false,
    error: null,
  },
  reducers: {
    // Example reducers
    getBorrowsRequest: (state) => {
      state.loading = true;
    },
    getBorrowsSuccess: (state, action) => {
      state.loading = false;
      state.myBorrows = action.payload;
    },
    // ... other reducers
  },
});

// 1. Export actions for your components
export const { getBorrowsRequest, getBorrowsSuccess } = borrowSlice.actions;

// ❌ This is the missing piece the store is looking for!
export default borrowSlice.reducer;