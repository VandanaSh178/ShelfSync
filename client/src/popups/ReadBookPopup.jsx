import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleReadBookPopup } from '../store/slices/popUpSlice';

const ReadBookPopup = ({ book = {} }) => {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-2xl shadow-xl sm:w-1/2 lg:w-1/3">

        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-white text-lg font-bold">Book Details</h2>
          <button
            onClick={() => dispatch(toggleReadBookPopup())}
            className="text-white text-2xl leading-none hover:text-orange-400 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Cover Image */}
        {book?.coverImage?.url && (
          <div className="flex justify-center pt-6 px-6">
            <img
              src={book.coverImage.url}
              alt={book.title}
              className="w-28 h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Fields */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Book Title</label>
            <p className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-900 font-semibold">
              {book?.title || "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Author</label>
            <p className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-700">
              {book?.author || "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Category</label>
            <p className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-700">
              {book?.category || "N/A"}
            </p>
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Description</label>
            <p className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 text-sm leading-relaxed">
              {book?.description || "N/A"}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Price</label>
              <p className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-700">
                ₹{book?.price ? book.price.toFixed(2) : "N/A"}
              </p>
            </div>
            <div className="flex-1">
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Quantity</label>
              <p className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-700">
                {book?.quantity ?? "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Footer outside the fields div */}
        <div className="flex justify-end px-6 py-4 bg-gray-100 rounded-b-2xl border-t border-gray-200">
          <button
            type="button"
            onClick={() => dispatch(toggleReadBookPopup())}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReadBookPopup;