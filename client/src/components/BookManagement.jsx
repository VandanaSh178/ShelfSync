import React, { useEffect, useState } from "react";
import { BookA, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleReadBookPopup, toggleRecordBookPopup, toggleAddBookPopup } from "../store/slices/popUpSlice";
import toast from "react-hot-toast";
import { fetchAllBorrows, resetBorrowSlice } from "../store/slices/borrowSlice";
import { fetchBooks, resetBookSlice } from "../store/slices/bookSlice";

// Import your popup components
import AddBookPopup from "../popups/AddBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();

  // 1. Extract State (Safely)
  const { loading, error, message, books = [] } = useSelector((state) => state.books || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const { 
    recordBookPopup, 
    readBookPopup, 
    addBookPopup 
  } = useSelector((state) => state.popups || {});
  
  const {
    error: borrowError,
    message: borrowMessage,
  } = useSelector((state) => state.borrow || {});

  // 2. Local State
  const [readBook, setReadBook] = useState({}); // ✅ ADDED THIS MISSING LINE
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");

  // 3. Handlers
  const openReadBookPopup = (id) => {
    const book = books.find((b) => b._id === id);
    setReadBook(book || {}); // ✅ Now this won't crash
    dispatch(toggleReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  // 4. Sync State & Toasts
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

  // 5. Search Logic
  const searchedBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(searchedKeyword.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchedBooks.length > 0 ? (
            searchedBooks.map((book) => (
              <div key={book._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-gray-100">
                  <img 
                    src={book.coverImage?.url || "https://placehold.co/150x200"} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = "https://placehold.co/150x200" }}
                  />
                </div>
                <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openReadBookPopup(book._id)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                  >
                    DETAILS
                  </button>
                  <button 
                    onClick={() => openRecordBookPopup(book._id)}
                    className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
                  >
                    BORROW
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <BookA className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No books found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* ✅ Popup Logic */}
      {addBookPopup && <AddBookPopup/>}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId}/>}
      {readBookPopup && <ReadBookPopup book={readBook}/>}
    </>
  );
};

export default BookManagement;