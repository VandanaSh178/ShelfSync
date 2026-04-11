import express from 'express';

import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';

import {
  addBook,
  deleteBook,
  getAllBooks,
} from '../controllers/bookController.js';


const router = express.Router();

router.post(
  "/admin/add",
  isAuthenticated,
  isAuthorized("admin"),
  addBook
);

router.get("/", getAllBooks);
router.delete("/:id", isAuthenticated, isAuthorized("admin"), deleteBook);


console.log(typeof isAuthenticated);
console.log(typeof isAuthorized("admin"));
console.log("addBook type:", typeof addBook);
export default router;