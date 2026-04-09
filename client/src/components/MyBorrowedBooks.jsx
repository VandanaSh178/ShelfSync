import React, { useState, useEffect } from "react";
import { BookA, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBorrows } from "../store/slices/borrowSlice";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { myBorrows = [] } = useSelector((state) => state.borrow || {});
  const { readBookPopup } = useSelector((state) => state.popups || {});
  const [filter, setFilter] = useState("active");
  const [readBook, setReadBook] = useState({});

  useEffect(() => {
    dispatch(fetchMyBorrows());
  }, [dispatch]);

  const openReadBookPopup = (record) => {
    setReadBook(record.book || {});
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const returnedBooks = myBorrows.filter((r) => r.returned === true);
  const activeBooks = myBorrows.filter((r) => r.returned === false);
  const booksToDisplay = filter === "returned" ? returnedBooks : activeBooks;

  return (
    <>
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">

        <header className="flex flex-col items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">
            My Borrowed Books
          </h2>
          <div className="flex">
            <button
              className={`border-2 font-semibold py-2 px-8 rounded-l-lg transition-all
                ${filter === "active" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`border-2 font-semibold py-2 px-8 rounded-r-lg transition-all
                ${filter === "returned" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}
              onClick={() => setFilter("returned")}
            >
              Returned
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">#</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Book Title</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Borrowed On</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Due Date</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {booksToDisplay.length > 0 ? (
                  booksToDisplay.map((record, index) => (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={record.book?.coverImage?.url || "https://placehold.co/40x55"}
                            alt="cover"
                            className="w-9 h-12 object-cover rounded-md flex-shrink-0"
                            onError={(e) => { e.target.src = "https://placehold.co/40x55"; }}
                          />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{record.book?.title || "Unknown Title"}</p>
                            <p className="text-xs text-gray-400">{record.book?.author || "Unknown Author"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(record.borrowDate || record.createdAt)}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`font-semibold ${new Date(record.dueDate) < new Date() && !record.returned ? "text-red-500" : "text-gray-500"}`}>
                          {formatDate(record.dueDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {record.returned ? (
                          <span className="text-[10px] bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold uppercase">Returned</span>
                        ) : new Date(record.dueDate) < new Date() ? (
                          <span className="text-[10px] bg-red-100 text-red-500 px-3 py-1 rounded-full font-bold uppercase">Overdue</span>
                        ) : (
                          <span className="text-[10px] bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-bold uppercase">In Use</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openReadBookPopup(record)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-orange-100 hover:text-orange-500 text-gray-400 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <BookA className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No {filter === "returned" ? "returned" : "active"} books found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ✅ Popup is now inside the fragment, not outside main */}
      {readBookPopup && <ReadBookPopup book={readBook} />}
    </>
  );
};

export default MyBorrowedBooks;