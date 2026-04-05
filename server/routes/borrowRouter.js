import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

import {
  borrowBook,
  returnBook,
  getBorrowedBooks,
  getBorrowHistory,
  getOverdueBooks,
  getBorrowStats,
} from "../controllers/borrowController.js";

console.log("Is borrowBook a function?", typeof borrowBook); // Check your terminal for this!

const router = express.Router();

/*
================================
USER ROUTES
================================
*/

// 📚 Borrow a book
router.post("/borrow", isAuthenticated, borrowBook);

// 🔄 Return a book
router.put("/return/:borrowId", isAuthenticated, returnBook);

// 📖 Active borrowed books
router.get("/my-borrows", isAuthenticated, getBorrowedBooks);

// 📜 Borrow history
router.get("/borrow-history", isAuthenticated, getBorrowHistory);


/*
================================
ADMIN ROUTES
================================
*/

// ⏰ Overdue books
router.get("/overdue", isAuthenticated, isAuthorized("admin"), getOverdueBooks);

// 📊 Stats
router.get("/stats", isAuthenticated, isAuthorized("admin"), getBorrowStats);

export default router;