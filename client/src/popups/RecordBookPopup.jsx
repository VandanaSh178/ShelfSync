import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleRecordBookPopup } from '../store/slices/popUpSlice';
import { recordBookBorrow } from '../store/slices/borrowSlice';

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleRecordBook = (e) => {
  e.preventDefault();
  console.log("bookId being sent:", bookId); // ← check this in browser console
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
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
              User Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
            />
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
              onClick={handleRecordBook}
              className="flex-1 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all active:scale-95"
            >
              Confirm Borrow
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecordBookPopup;