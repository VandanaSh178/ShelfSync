import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleRecordBookPopup } from "./popUpSlice";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    myBorrows: [],
    allBorrows: [], 
    borrowHistory:[],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    // --- Actions for My Borrows (User) ---
    fetchMyBorrowsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMyBorrowsSuccess: (state, action) => {
      state.loading = false;  
      state.myBorrows = action.payload; // payload: data.borrows
    },
    fetchMyBorrowsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Actions for All Borrows (Admin) ---
    fetchAllBorrowsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAllBorrowsSuccess: (state, action) => {
      state.loading = false;  
      state.allBorrows = action.payload; // payload: data.allBorrows
    },
    fetchAllBorrowsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Borrowing Logic ---
    recordBookRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload; 
    },
    recordBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Returning Logic ---
    returnBookRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchBorrowHistorySuccess: (state, action) => {
      state.borrowHistory = action.payload;
    },



    resetBorrowSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const { 
  fetchMyBorrowsRequest, fetchMyBorrowsSuccess, fetchMyBorrowsFailure,
  recordBookRequest, recordBookSuccess, recordBookFailure,
  fetchAllBorrowsRequest, fetchAllBorrowsSuccess, fetchAllBorrowsFailure,
  returnBookRequest, returnBookSuccess, returnBookFailure,
  fetchBorrowHistorySuccess,
  resetBorrowSlice
} = borrowSlice.actions;

// --- Thunks (API Calls) ---

// 1. Fetch User's Active Borrows
export const fetchMyBorrows = () => async (dispatch) => {
  dispatch(fetchMyBorrowsRequest());
  try {
    const { data } = await axios.get("https://shelfsync-api.onrender.com/api/borrow/my-borrows", { withCredentials: true });
    // Note: Matches 'borrows' key from your getBorrowedBooks controller
    dispatch(fetchMyBorrowsSuccess(data.borrows)); 
  } catch (error) {
    dispatch(fetchMyBorrowsFailure(error.response?.data?.message || "Failed to load your books"));
  }
};

// 2. Fetch All Borrows (Admin)
export const fetchAllBorrows = () => async (dispatch) => {
  dispatch(fetchAllBorrowsRequest());
  try {
    const { data } = await axios.get("https://shelfsync-api.onrender.com/api/borrow/all", { withCredentials: true });
    dispatch(fetchAllBorrowsSuccess(data.allBorrows));
  } catch (error) {
    dispatch(fetchAllBorrowsFailure(error.response?.data?.message || "Admin Error: Failed to load all records"));
  }
};

// 3. Borrow a Book
export const recordBookBorrow = (bookId) => async (dispatch) => {
  dispatch(recordBookRequest());
  try {
    const { data } = await axios.post(
      "https://shelfsync-api.onrender.com/api/borrow/borrow", 
      { bookId }, 
      { withCredentials: true }
    );
    dispatch(recordBookSuccess(data.message));
    dispatch(fetchMyBorrows()); // Refresh list immediately
    dispatch(toggleRecordBookPopup()); // Close popup on success
  } catch (error) {
    dispatch(recordBookFailure(error.response?.data?.message || "Borrowing failed"));
  }
};

// 4. Return a Book
// 4. Return a Book
export const returnBorrowedBook = (borrowId) => async (dispatch) => {
  dispatch(returnBookRequest());
  try {
    const { data } = await axios.put(
      `https://shelfsync-api.onrender.com/api/borrow/return/${borrowId}`, // ✅ borrowId in URL
      {},                                                     // ✅ empty body
      { withCredentials: true }
    );
    dispatch(returnBookSuccess(data.message));
    dispatch(fetchMyBorrows());
  } catch (error) {
    dispatch(returnBookFailure(error.response?.data?.message || "Return failed"));
  }
};

export const fetchBorrowHistory = () => async (dispatch) => {
  try {
    const { data } = await axios.get("https://shelfsync-api.onrender.com/api/borrow/borrow-history", { withCredentials: true });
    dispatch(fetchBorrowHistorySuccess(data.history));
  } catch (error) {
    console.error("Failed to fetch borrow history:", error);
  }
};

export default borrowSlice.reducer;