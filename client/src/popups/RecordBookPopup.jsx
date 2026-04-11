import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRecordBookPopup } from '../store/slices/popUpSlice';
import { recordBookBorrow } from '../store/slices/borrowSlice';

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleRecordBook = (e) => {
    e.preventDefault();
    if (!bookId) return;
    dispatch(recordBookBorrow(bookId));
    dispatch(toggleRecordBookPopup());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-2xl shadow-xl sm:w-1/2 lg:w-1/3">

        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-white text-lg font-bold">Borrow Book</h2>
          <button
            onClick={() => dispatch(toggleRecordBookPopup())}
            className="text-white text-2xl leading-none hover:text-orange-400 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRecordBook} className="p-6 space-y-4">

          {/* Auto-filled user info */}
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
              Borrowing As
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-black">
                  {user?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{user?.name || "Unknown"}</p>
                <p className="text-xs text-gray-400">{user?.email || "No email"}</p>
              </div>
            </div>
          </div>

          {/* Borrow info */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
            <p className="text-xs text-orange-700 font-semibold">
              📅 Due date will be set to <span className="font-black">7 days</span> from today.
            </p>
            <p className="text-xs text-orange-500 mt-1">
              Late returns may incur a fine.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => dispatch(toggleRecordBookPopup())}
              className="flex-1 py-2 rounded-lg border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all active:scale-95"
            >
              Confirm Borrow
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RecordBookPopup;