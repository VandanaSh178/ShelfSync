import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewBook, fetchBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddBook = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("title", title);
  formData.append("author", author);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("quantity", quantity);
  if (coverImage) formData.append("coverImage", coverImage);

  await dispatch(addNewBook(formData)); // ✅ updated name
  dispatch(fetchBooks());
};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm p-5 flex items-center justify-center z-50">
      <div className="w-11/12 bg-white rounded-2xl shadow-xl sm:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-4 rounded-t-2xl sticky top-0">
          <h2 className="text-lg font-bold">Add New Book</h2>
          <button
            onClick={() => dispatch(toggleAddBookPopup())}
            className="text-white text-2xl leading-none hover:text-orange-400 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all bg-white"
            >
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Education">Education</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Book description"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-gray-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-500 file:font-semibold hover:file:bg-orange-100 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => dispatch(toggleAddBookPopup())}
              className="flex-1 py-2 rounded-lg border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddBook}
              className="flex-1 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all active:scale-95"
            >
              Add Book
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddBookPopup;