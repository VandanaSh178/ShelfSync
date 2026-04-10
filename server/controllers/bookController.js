import ErrorHandler from '../middlewares/errorMiddleware.js';
import { Book } from '../models/bookModel.js';
import { v2 as cloudinary } from 'cloudinary';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import { Notification } from "../models/notificationModel.js";

// ADD BOOK
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity, category } = req.body || {};

  if (!title || !author || !description || !price || !quantity || !category) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const existingBook = await Book.findOne({ title, author });
  if (existingBook) {
    return next(new ErrorHandler("Book already exists", 400));
  }

  let coverImage = {};
  if (req.files && req.files.coverImage) {
    const file = req.files.coverImage;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "shelfsync/books",
      width: 300,
      crop: "scale",
    });
    coverImage = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
    category,
    available: quantity > 0,
    coverImage,
  });

  await Notification.create({
    message: `New book added: "${book.title}" by ${book.author}`,
    type: "book_added",
    forRole: "all",
    relatedBook: book._id,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

// GET ALL BOOKS
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: books.length,
    books,
  });
});

// DELETE BOOK
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  if (book.coverImage?.public_id) {
    await cloudinary.uploader.destroy(book.coverImage.public_id);
  }

  await book.deleteOne();

  await Notification.create({
    message: `Book removed: "${book.title}"`,
    type: "book_deleted",
    forRole: "all",
  });

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

// ADD BULK BOOKS
export const addBulkBooks = catchAsyncErrors(async (req, res, next) => {
  const books = req.body;

  if (!Array.isArray(books) || books.length === 0) {
    return next(new ErrorHandler("Please provide an array of books", 400));
  }

  const insertedBooks = await Book.insertMany(
    books.map((b) => ({ ...b, available: b.quantity > 0 }))
  );

  res.status(201).json({
    success: true,
    message: `${insertedBooks.length} books added successfully`,
    books: insertedBooks,
  });
});