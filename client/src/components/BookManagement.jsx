import React, { useEffect, useState } from "react";
import { BookA, Search, Eye, BookOpen, Plus, X, Library } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleReadBookPopup, toggleRecordBookPopup, toggleAddBookPopup } from "../store/slices/popUpSlice";
import toast from "react-hot-toast";
import { fetchAllBorrows, resetBorrowSlice } from "../store/slices/borrowSlice";
import { fetchBooks, resetBookSlice } from "../store/slices/bookSlice";

import AddBookPopup from "../popups/AddBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";

const C = {
  bg: "#faf6f0",
  bgDeep: "#f5ede0",
  bgCard: "#ffffff",
  border: "#e8ddd0",
  orange: "#f97316",
  orangeDeep: "#ea580c",
  textPrimary: "#2d1f0e",
  textMuted: "#a89070",
  textFaint: "#c4a882",
  dark: "#1a1612",
  green: "#22c55e",
};

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books = [] } = useSelector((state) => state.books || {});
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const { recordBookPopup, readBookPopup, addBookPopup } = useSelector((state) => state.popup || {});
  const { error: borrowError, message: borrowMessage } = useSelector((state) => state.borrow || {});

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isAdmin = user?.role === "admin";

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
    setTimeout(() => setMounted(true), 60);
  }, [dispatch]);

  useEffect(() => {
    if (message || borrowMessage) {
      toast.success(message || borrowMessage);
      dispatch(fetchBooks());
      if (isAdmin) dispatch(fetchAllBorrows());
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

  const available = books.filter((b) => b.quantity > 0).length;
  const outOfStock = books.filter((b) => b.quantity === 0).length;

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          background: C.bg,
          padding: "28px 28px 40px",
          fontFamily: "system-ui, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* ── Page header ── */}
        <div
          style={{
            marginBottom: 24,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: C.orange, margin: "0 0 6px" }}>
            {isAdmin ? "Admin" : "Browse"}
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.textPrimary, fontFamily: "Georgia, serif", margin: 0, letterSpacing: "-0.02em" }}>
            {isAdmin ? "Book Management" : "Library Catalog"}
          </h1>
          <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>
            {isAdmin ? "Manage and view all available books in the library" : "Browse all books available for borrowing"}
          </p>
        </div>

        {/* ── Stat chips + controls row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease 80ms, transform 0.4s ease 80ms",
          }}
        >
          {/* Stat chips */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Total Books", value: books.length, bg: C.bgCard, border: C.border, color: C.textPrimary },
              { label: "Available", value: available, bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
              ...(outOfStock > 0
                ? [{ label: "Out of Stock", value: outOfStock, bg: "#fef2f2", border: "#fecaca", color: "#dc2626" }]
                : []),
            ].map(({ label, value, bg, border, color }) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "8px 14px",
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 900, color, fontFamily: "Georgia, serif", lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "9px 14px",
                background: searchFocused ? C.bgCard : C.bgDeep,
                border: `1.5px solid ${searchFocused ? C.orange : C.border}`,
                borderRadius: 12,
                boxShadow: searchFocused ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
                transition: "all 0.2s ease",
                minWidth: 220,
              }}
            >
              <Search size={13} color={searchFocused ? C.orange : C.textFaint} />
              <input
                type="text"
                placeholder="Search by title…"
                value={searchedKeyword}
                onChange={(e) => setSearchedKeyword(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  color: C.textPrimary,
                  fontFamily: "system-ui, sans-serif",
                }}
              />
              {searchedKeyword && (
                <button
                  onClick={() => setSearchedKeyword("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.textFaint, display: "flex" }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Add Book button (admin only) */}
            {isAuthenticated && isAdmin && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "9px 18px",
                  background: C.dark,
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.orange;
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = C.dark;
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                }}
              >
                <Plus size={13} />
                Add New Book
              </button>
            )}
          </div>
        </div>

        {/* ── Table card ── */}
        <div
          style={{
            background: C.bgCard,
            border: `1.5px solid ${C.border}`,
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            overflow: "hidden",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease 160ms, transform 0.5s ease 160ms",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.bgDeep, borderBottom: `1.5px solid ${C.border}` }}>
                  {["#", "Book", "Author", "Category", "Price", "Qty", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 18px", textAlign: "left",
                        fontSize: 8, fontWeight: 800, letterSpacing: "0.22em",
                        textTransform: "uppercase", color: C.textFaint,
                        fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "60px 0", textAlign: "center" }}>
                      <div style={{ width: 24, height: 24, border: `2px solid ${C.border}`, borderTopColor: C.orange, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                    </td>
                  </tr>
                ) : searchedBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "60px 0", textAlign: "center" }}>
                      <div style={{ width: 52, height: 52, background: C.bgDeep, border: `1.5px solid ${C.border}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <BookA size={22} color={C.textFaint} />
                      </div>
                      <p style={{ fontSize: 12, color: C.textMuted, margin: 0, fontWeight: 700, fontFamily: "Georgia, serif" }}>
                        {searchedKeyword ? "No books match your search" : "No books in the catalog"}
                      </p>
                      <p style={{ fontSize: 10, color: C.textFaint, margin: "5px 0 0" }}>
                        {searchedKeyword ? "Try a different keyword" : isAdmin ? "Add your first book to get started" : "Check back later"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  searchedBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.bgDeep)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* # */}
                      <td style={{ padding: "14px 18px", fontSize: 10, color: C.textFaint, fontFamily: "Georgia, serif", fontWeight: 700, width: 40 }}>
                        {index + 1}
                      </td>

                      {/* Book */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 50, borderRadius: 7, overflow: "hidden", flexShrink: 0, border: `1px solid ${C.border}`, boxShadow: "2px 2px 8px rgba(0,0,0,0.1)" }}>
                            {book.coverImage?.url ? (
                              <img
                                src={book.coverImage.url}
                                alt={book.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { e.target.style.display = "none"; e.target.parentNode.style.background = C.dark; }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <BookOpen size={12} color="#fff" />
                              </div>
                            )}
                          </div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                            {book.title}
                          </p>
                        </div>
                      </td>

                      {/* Author */}
                      <td style={{ padding: "14px 18px", fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>
                        {book.author}
                      </td>

                      {/* Category */}
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          background: C.bgDeep,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          fontSize: 9,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: C.textMuted,
                          whiteSpace: "nowrap",
                        }}>
                          {book.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: C.textPrimary, fontFamily: "Georgia, serif" }}>
                          ₹{book.price}
                        </span>
                      </td>

                      {/* Qty */}
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 900,
                          color: book.quantity === 0 ? "#dc2626" : book.quantity <= 3 ? C.orange : C.textPrimary,
                          fontFamily: "Georgia, serif",
                        }}>
                          {book.quantity}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 18px" }}>
                        {book.quantity > 0 ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />
                            Available
                          </span>
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          {/* View */}
                          <button
                            onClick={() => openReadBookPopup(book._id)}
                            title="View Details"
                            style={{
                              width: 32, height: 32, borderRadius: 9,
                              border: `1.5px solid ${C.border}`,
                              background: C.bgDeep,
                              cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.2s ease",
                              color: C.textMuted,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#fff7ed"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.color = C.orange; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = C.bgDeep; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
                          >
                            <Eye size={13} />
                          </button>

                          {/* Borrow */}
                          <button
                            onClick={() => openRecordBookPopup(book._id)}
                            disabled={book.quantity === 0}
                            title={book.quantity === 0 ? "Out of stock" : "Borrow Book"}
                            style={{
                              width: 32, height: 32, borderRadius: 9,
                              border: "none",
                              background: book.quantity === 0 ? C.bgDeep : `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                              cursor: book.quantity === 0 ? "not-allowed" : "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "all 0.2s ease",
                              opacity: book.quantity === 0 ? 0.45 : 1,
                              boxShadow: book.quantity === 0 ? "none" : "0 2px 8px rgba(249,115,22,0.3)",
                            }}
                            onMouseEnter={(e) => { if (book.quantity > 0) e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.45)"; }}
                            onMouseLeave={(e) => { if (book.quantity > 0) e.currentTarget.style.boxShadow = "0 2px 8px rgba(249,115,22,0.3)"; }}
                          >
                            <BookOpen size={13} color={book.quantity === 0 ? C.textFaint : "#fff"} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {searchedBooks.length > 0 && (
            <div style={{ padding: "10px 18px", borderTop: `1px solid ${C.border}`, background: C.bgDeep, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 10, color: C.textMuted, margin: 0, fontWeight: 600 }}>
                Showing <span style={{ color: C.textPrimary, fontWeight: 800 }}>{searchedBooks.length}</span> of{" "}
                <span style={{ color: C.textPrimary, fontWeight: 800 }}>{books.length}</span> books
              </p>
              {searchedKeyword && (
                <button
                  onClick={() => setSearchedKeyword("")}
                  style={{ fontSize: 10, color: C.orange, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "system-ui" }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {addBookPopup && <AddBookPopup />}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
      {readBookPopup && <ReadBookPopup book={readBook} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
};

export default BookManagement;