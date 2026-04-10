import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import popupReducer from "./slices/popUpSlice";
import bookReducer from "./slices/bookSlice";
import borrowReducer from "./slices/borrowSlice";
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,     // Core: Session & Security
    popup: popupReducer,   // UI: Modal & Sidebar visibility
    books: bookReducer,    // Inventory: Catalog & Search
    borrow: borrowReducer, // Transactions: Active Loans & History
    users: userReducer,     // Registry: Member & Admin Management
    notifications: notificationReducer,
  },
  // Adding middleware configuration for high-performance "ShelfSync" operations
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: useful if handling complex Date objects or specialized blobs
    }),
});

// For complex debugging, the DevTools are active by default in development
export default store;