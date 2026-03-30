import { createSlice } from "@reduxjs/toolkit";

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Your reducers here...
    setBooks: (state, action) => {
      state.books = action.payload;
    },
  },
});

// 1. Named exports for components (like Sidebar/Catalog)
export const { setBooks } = bookSlice.actions;

// ❌ CRITICAL: This is the 'default' export the store is crying for
export default bookSlice.reducer;