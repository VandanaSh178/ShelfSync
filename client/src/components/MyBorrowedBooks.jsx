import React, { useState, useEffect } from "react"; // ✅ Added useEffect
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBorrows } from "../store/slices/borrowSlice"; // ✅ Added
import { toggleReadBookPopup } from "../store/slices/popUpSlice"; // ✅ Added
import Header from "../layout/Header"; // ✅ Ensure this is uncommented/imported

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  // 1. Extract State (Added fallbacks to prevent undefined errors)
  const { books = [] } = useSelector((state) => state.books || {});
  const { myBorrows = [] } = useSelector((state) => state.borrow || {});
  const { readBookPopup } = useSelector((state) => state.popups || {}); // ✅ Changed 'popup' to 'popups'

  // 2. Fetch data on mount
  useEffect(() => {
    dispatch(fetchMyBorrows());
  }, [dispatch]);

  // 3. Popup Logic
  const [readBook, setReadBook] = useState({});
  const openReadBookPopup = (id) => {
    // Find book details from the books slice or the borrow record
    const book = books.find((b) => b._id === id);
    setReadBook(book || {});
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  // 4. Filtering Logic
  const [filter, setFilter] = useState("active"); // Defaulting to 'active' is better UX

  // ✅ Changed from .status (string) to .returned (boolean) to match your Backend
  const returnedBooks = myBorrows.filter((record) => record.returned === true);
  const activeBorrows = myBorrows.filter((record) => record.returned === false);

  const booksToDisplay = filter === "returned" ? returnedBooks : activeBorrows;

  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* <Header /> */}
      
      <header className="flex flex-col items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">
          My Borrowed Books
        </h2>
        
        {/* Filter Toggle */}
        <div className="flex bg-gray-200 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setFilter("active")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === "active" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}
          >
            ACTIVE
          </button>
          <button 
            onClick={() => setFilter("returned")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${filter === "returned" ? "bg-white shadow-sm text-black" : "text-gray-500"}`}
          >
            HISTORY
          </button>
        </div>
      </header>

      {/* Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {booksToDisplay.length > 0 ? (
          booksToDisplay.map((record) => (
            <div key={record._id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-20 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                   <img 
                    src={record.book?.coverImage?.url || "https://placehold.co/80x110"} 
                    alt="cover" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/80x110" }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{record.book?.title || "Unknown Title"}</h3>
                  <p className="text-xs text-gray-400 mb-2 italic">Due: {formatDate(record.dueDate)}</p>
                  
                  {record.returned ? (
                    <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold uppercase">Returned</span>
                  ) : (
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold uppercase">In Use</span>
                  )}
                  
                  <button 
                    onClick={() => openReadBookPopup(record.book?._id)}
                    className="block mt-4 text-[10px] font-black text-orange-500 hover:underline uppercase"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <BookA className="w-12 h-12 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400">No {filter} books found.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBorrowedBooks;