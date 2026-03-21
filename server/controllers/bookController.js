import ErrorHandler from '../middlewares/errorMiddleware.js';
import { Book } from '../models/bookModel.js';

// ADD BOOK
export const addBook = async (req, res, next) => {
  try {
    console.log("4️⃣ inside controller");

    const { title, author, description, price, quantity } = req.body || {};

    if (!title || !author || !description || !price || !quantity) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const existingBook = await Book.findOne({ title, author });

    if (existingBook) {
      return next(new ErrorHandler("Book already exists", 400));
    }

    const book = await Book.create({
      title,
      author,
      description,
      price,
      quantity,
      available: quantity > 0,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });

  } catch (error) {
    console.log("❌ Controller Error:", error);
    next(error);
  }
};


// GET ALL BOOKS
export const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });

  } catch (error) {
    next(error);
  }
};


// DELETE BOOK
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new ErrorHandler("Book not found", 404));
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      deletedBook: book,
    });

  } catch (error) {
    next(error);
  }
};