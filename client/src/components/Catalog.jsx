import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, BookA } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAllBorrows, resetBorrowSlice } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();

  const { returnBookPopup } = useSelector((state) => state.popups);
  const { loading, error, message, allBorrows = [] } = useSelector((state) => state.borrow);

  const [filter, setFilter] = useState("borrowed");
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(fetchAllBorrows());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBorrows());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [message, error, dispatch]);

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const currentDate = new Date();

  const borrowedBooks = allBorrows.filter((b) => new Date(b.dueDate) >= currentDate && !b.returned);
  const overdueBooks = allBorrows.filter((b) => new Date(b.dueDate) < currentDate && !b.returned);
  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;

  const openReturnBookPopup = (borrowId, userEmail) => {
    setBorrowedBookId(borrowId);
    setEmail(userEmail);
    dispatch(toggleReturnBookPopup());
  };

  return (
    <>
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">

        <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Borrow Inventory</h2>
            <p className="text-gray-500 text-sm">Track all active and overdue borrowings.</p>
          </div>

          {/* Filter */}
          <div className="flex">
            <button
              className={`border-2 font-semibold py-2 px-8 rounded-l-lg transition-all
                ${filter === "borrowed" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}
              onClick={() => setFilter("borrowed")}
            >
              Active
            </button>
            <button
              className={`border-2 font-semibold py-2 px-8 rounded-r-lg transition-all
                ${filter === "overdue" ? "bg-black text-white border-black" : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}
              onClick={() => setFilter("overdue")}
            >
              Overdue
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">#</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Book</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Borrower</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Borrowed On</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Due Date</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {booksToDisplay.length > 0 ? (
                  booksToDisplay.map((record, index) => (
                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">

                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{index + 1}</td>

                      {/* Book */}
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

                      {/* Borrower */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 text-xs">{record.user?.name || "N/A"}</p>
                        <p className="text-gray-400 text-xs">{record.user?.email || "N/A"}</p>
                      </td>

                      {/* Borrowed On */}
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {formatDate(record.borrowDate || record.createdAt)}
                      </td>

                      {/* Due Date */}
                      <td className="px-6 py-4 text-xs">
                        <span className={`font-semibold ${new Date(record.dueDate) < new Date() ? "text-red-500" : "text-gray-500"}`}>
                          {formatDate(record.dueDate)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {new Date(record.dueDate) < new Date() ? (
                          <span className="text-[10px] bg-red-100 text-red-500 px-3 py-1 rounded-full font-bold uppercase">Overdue</span>
                        ) : (
                          <span className="text-[10px] bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-bold uppercase">In Use</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openReturnBookPopup(record._id, record.user?.email)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase rounded-lg hover:bg-gray-800 transition-all active:scale-95"
                        >
                          Return
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <BookA className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No {filter === "borrowed" ? "active" : "overdue"} books found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {returnBookPopup && <ReturnBookPopup borrowId={borrowedBookId} email={email} />}
    </>
  );
};

export default Catalog;