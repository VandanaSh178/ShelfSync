import React, { useEffect, useState } from "react";
import { BookA, Search, Eye, BookOpen } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleReadBookPopup, toggleRecordBookPopup, toggleAddBookPopup } from "../store/slices/popUpSlice";
import toast from "react-hot-toast";
import { fetchAllBorrows, resetBorrowSlice } from "../store/slices/borrowSlice";
import { fetchBooks, resetBookSlice } from "../store/slices/bookSlice";

import AddBookPopup from "../popups/AddBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books = [] } = useSelector((state) => state.books || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const { recordBookPopup, readBookPopup, addBookPopup } = useSelector((state) => state.popup || {});
  const { error: borrowError, message: borrowMessage } = useSelector((state) => state.borrow || {});

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const openReadBookPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setReadBook(book || {});
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message || borrowMessage) {
      toast.success(message || borrowMessage);
      dispatch(fetchBooks());
      if (user?.role === "admin") dispatch(fetchAllBorrows());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error || borrowError) {
      toast.error(error || borrowError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, error, borrowMessage, borrowError, user]);

  const searchedBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(searchedKeyword.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === "admin" ? "Book Management" : "Library Catalog"}
            </h2>
            <p className="text-gray-500 text-sm">Manage and view all available books.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchedKeyword}
                onChange={(e) => setSearchedKeyword(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none w-full sm:w-64 transition-all"
              />
            </div>
            {isAuthenticated && user?.role === "admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="flex items-center justify-center gap-2 py-2 px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95 font-medium"
              >
                <span className="text-lg">+</span> Add New Book
              </button>
            )}
          </div>
        </header>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">#</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Book</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Author</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Quantity</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {searchedBooks.length > 0 ? (
                  searchedBooks.map((book, index) => (
                    <tr key={book._id} className="hover:bg-gray-50 transition-colors">

                      {/* # */}
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        {index + 1}
                      </td>

                      {/* Book */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage?.url || "https://placehold.co/40x55"}
                            alt={book.title}
                            className="w-9 h-12 object-cover rounded-md flex-shrink-0"
                            onError={(e) => { e.target.src = "https://placehold.co/40x55"; }}
                          />
                          <p className="font-bold text-gray-900 line-clamp-1 max-w-[160px]">{book.title}</p>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-6 py-4 text-gray-500 text-xs">{book.author}</td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-bold uppercase">
                          {book.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        ₹{book.price}
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 text-gray-700">
                        {book.quantity}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {book.quantity > 0 ? (
                          <span className="text-[10px] bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold uppercase">
                            Available
                          </span>
                        ) : (
                          <span className="text-[10px] bg-red-100 text-red-500 px-3 py-1 rounded-full font-bold uppercase">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openReadBookPopup(book._id)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-orange-100 hover:text-orange-500 text-gray-400 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openRecordBookPopup(book._id)}
                            disabled={book.quantity === 0}
                            className="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Borrow Book"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <BookA className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400">No books found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {addBookPopup && <AddBookPopup />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default BookManagement;