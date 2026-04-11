import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice";
import toast from "react-hot-toast";

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    fetchBooksRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBookRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload; // Store the success message string
    },
    addBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// ✅ Export actions so they can be used in dispatch
export const { 
  fetchBooksRequest, 
  fetchBooksSuccess, 
  fetchBooksFailure, 
  addBookRequest, 
  addBookSuccess, 
  addBookFailure, 
  resetBookSlice 
} = bookSlice.actions;

// ✅ Fetch All Books
export const fetchBooks = () => async (dispatch) => {
  dispatch(fetchBooksRequest());
  try {
    const response = await axios.get("https://shelfsync-api.onrender.com/api/books/", { 
      withCredentials: true 
    });
    dispatch(fetchBooksSuccess(response.data.books));
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch books";
    dispatch(fetchBooksFailure(message));
  }
};

// ✅ Add New Book (Admin)
export const addNewBook = (formData) => async (dispatch) => {
  dispatch(addBookRequest());
  try {
    const response = await axios.post(
      "https://shelfsync-api.onrender.com/api/books/admin/add", 
      formData, // Use the correct variable name here
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }, // Change to multipart if you are uploading covers
      }
    );
    dispatch(addBookSuccess(response.data.message));
    toast.success(response.data.message);
    dispatch(toggleAddBookPopup()); // Close the popup after successful addition
    dispatch(fetchBooks()); // Refresh the book list to show the new book
  } catch (error) {
    const message = error.response?.data?.message || "Failed to add book";
    dispatch(addBookFailure(message));
  }
};


export default bookSlice.reducer;