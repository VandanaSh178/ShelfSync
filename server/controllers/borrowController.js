import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

/*
================================
BORROW BOOK
================================
*/
export const borrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.body;

  if (!bookId) {
    return next(new ErrorHandler("Book ID is required", 400));
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  if (book.quantity <= 0) {
    return next(new ErrorHandler("Book not available", 400));
  }

  // Prevent duplicate borrow
  const alreadyBorrowed = await Borrow.findOne({
    user: req.user._id,
    book: bookId,
    returned: false,
  });

  if (alreadyBorrowed) {
    return next(new ErrorHandler("You already borrowed this book", 400));
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const borrow = await Borrow.create({
    user: req.user._id,
    book: book._id,
    price: book.price,
    dueDate,
  });

  book.quantity -= 1;
  await book.save();

  res.status(201).json({
    success: true,
    message: "Book borrowed successfully",
    borrow,
  });
});

/*
================================
RETURN BOOK
================================
*/
export const returnBook = catchAsyncErrors(async (req, res, next) => {
  const { borrowId } = req.params;

  const borrow = await Borrow.findById(borrowId);

  if (!borrow || borrow.returned) {
    return next(new ErrorHandler("Invalid borrow record", 400));
  }

  const returnDate = new Date();

  const fine = calculateFine(borrow.dueDate, returnDate);

  borrow.returned = true;
  borrow.returnDate = returnDate;
  borrow.fine = fine;

  await borrow.save();

  const book = await Book.findById(borrow.book);
  if (book) {
    book.quantity += 1;
    await book.save();
  }

  res.status(200).json({
    success: true,
    message: "Book returned successfully",
    fine,
  });
});

/*
================================
MY ACTIVE BORROWS
================================
*/
export const getBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const borrows = await Borrow.find({
    user: req.user._id,
    returned: false,
  }).populate("book", "title author");

  res.status(200).json({
    success: true,
    count: borrows.length,
    borrows,
  });
});

/*
================================
BORROW HISTORY
================================
*/
export const getBorrowHistory = catchAsyncErrors(async (req, res, next) => {
  const history = await Borrow.find({
    user: req.user._id,
  })
    .populate("book", "title author")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: history.length,
    history,
  });
});

/*
================================
OVERDUE BOOKS (ADMIN)
================================
*/
export const getOverdueBooks = catchAsyncErrors(async (req, res, next) => {
  const overdue = await Borrow.find({
    returned: false,
    dueDate: { $lt: new Date() },
  })
    .populate("user", "name email")
    .populate("book", "title");

  res.status(200).json({
    success: true,
    count: overdue.length,
    overdue,
  });
});

/*
================================
BORROW STATS
================================
*/
export const getBorrowStats = catchAsyncErrors(async (req, res, next) => {
  const total = await Borrow.countDocuments();
  const active = await Borrow.countDocuments({ returned: false });

  res.status(200).json({
    success: true,
    totalBorrowed: total,
    activeBorrowed: active,
  });
});