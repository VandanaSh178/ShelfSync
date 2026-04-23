import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BookA, BookOpen, Clock, AlertCircle, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAllBorrows, resetBorrowSlice } from "../store/slices/borrowSlice";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";

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

const Catalog = () => {
  const dispatch = useDispatch();
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, message, allBorrows = [] } = useSelector((state) => state.borrow);

  const [filter, setFilter] = useState("borrowed");
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBorrows());
    setTimeout(() => setMounted(true), 60);
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

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
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

  const tabs = [
    { key: "borrowed", label: "Active", count: borrowedBooks.length },
    { key: "overdue", label: "Overdue", count: overdueBooks.length },
  ];

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

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
            Admin
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.textPrimary, fontFamily: "Georgia, serif", margin: 0, letterSpacing: "-0.02em" }}>
            Borrow Inventory
          </h1>
          <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>
            Track all active and overdue borrowings across the library
          </p>
        </div>

        {/* ── Stat chips + tabs ── */}
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
              { label: "Total", value: allBorrows.filter(b => !b.returned).length, bg: C.bgCard, border: C.border, color: C.textPrimary },
              { label: "Active", value: borrowedBooks.length, bg: "#fff7ed", border: "rgba(249,115,22,0.2)", color: C.orange },
              { label: "Overdue", value: overdueBooks.length, bg: "#fef2f2", border: "#fecaca", color: "#dc2626" },
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

          {/* Toggle tabs */}
          <div style={{ display: "flex", background: C.bgDeep, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 4, gap: 3 }}>
            {tabs.map(({ key, label, count }) => {
              const active = filter === key;
              const isOverdueTab = key === "overdue";
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 16px",
                    borderRadius: 9,
                    border: active ? `1.5px solid ${isOverdueTab ? "#fecaca" : "rgba(249,115,22,0.2)"}` : "1.5px solid transparent",
                    background: active ? C.bgCard : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? C.textPrimary : C.textMuted, letterSpacing: "0.02em", transition: "color 0.2s" }}>
                    {label}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 6,
                    background: active ? (isOverdueTab ? "#dc2626" : C.orange) : C.border,
                    color: active ? "#fff" : C.textMuted,
                    transition: "all 0.2s",
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
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
                  {["#", "Book", "Borrower", "Borrowed On", "Due Date", "Status", "Action"].map((h) => (
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
                    <td colSpan={7} style={{ padding: "60px 0", textAlign: "center" }}>
                      <div style={{ width: 24, height: 24, border: `2px solid ${C.border}`, borderTopColor: C.orange, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
                    </td>
                  </tr>
                ) : booksToDisplay.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "60px 0", textAlign: "center" }}>
                      <div style={{ width: 52, height: 52, background: C.bgDeep, border: `1.5px solid ${C.border}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <BookA size={22} color={C.textFaint} />
                      </div>
                      <p style={{ fontSize: 12, color: C.textMuted, margin: 0, fontWeight: 700, fontFamily: "Georgia, serif" }}>
                        No {filter === "borrowed" ? "active" : "overdue"} books found
                      </p>
                      <p style={{ fontSize: 10, color: C.textFaint, margin: "5px 0 0" }}>
                        {filter === "borrowed" ? "No books are currently borrowed" : "All borrowings are within their due date"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  booksToDisplay.map((record, index) => {
                    const overdue = new Date(record.dueDate) < currentDate;
                    return (
                      <tr
                        key={record._id}
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
                              {record.book?.coverImage?.url ? (
                                <img
                                  src={record.book.coverImage.url}
                                  alt="cover"
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => { e.target.style.display = "none"; e.target.parentNode.style.background = C.dark; }}
                                />
                              ) : (
                                <div style={{ width: "100%", height: "100%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <BookOpen size={12} color="#fff" />
                                </div>
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                                {record.book?.title || "Unknown Title"}
                              </p>
                              <p style={{ fontSize: 10, color: C.textMuted, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                                {record.book?.author || "Unknown Author"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Borrower */}
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: `1.5px solid rgba(249,115,22,0.15)` }}>
                              {record.user?.avatar?.url ? (
                                <img src={record.user.avatar.url} alt={record.user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <span style={{ color: "#fff", fontSize: 9, fontWeight: 800 }}>{getInitials(record.user?.name)}</span>
                                </div>
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
                                {record.user?.name || "N/A"}
                              </p>
                              <p style={{ fontSize: 10, color: C.textMuted, margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
                                {record.user?.email || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Borrowed On */}
                        <td style={{ padding: "14px 18px", fontSize: 11, color: C.textMuted, whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Clock size={10} color={C.textFaint} />
                            {formatDate(record.borrowDate || record.createdAt)}
                          </div>
                        </td>

                        {/* Due Date */}
                        <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: overdue ? "#dc2626" : C.textMuted }}>
                            {overdue && <AlertCircle size={10} color="#dc2626" style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />}
                            {formatDate(record.dueDate)}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "14px 18px" }}>
                          {overdue ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                              Overdue
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "#fff7ed", color: C.orange, border: `1px solid rgba(249,115,22,0.2)`, borderRadius: 8, fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, display: "inline-block", animation: "pulse 2s infinite" }} />
                              In Use
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td style={{ padding: "14px 18px" }}>
                          <button
                            onClick={() => openReturnBookPopup(record._id, record.user?.email)}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "6px 14px",
                              background: C.dark,
                              color: "#fff",
                              border: "none",
                              borderRadius: 9,
                              fontSize: 9,
                              fontWeight: 800,
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              whiteSpace: "nowrap",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = C.orange;
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(249,115,22,0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = C.dark;
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                            }}
                          >
                            <RotateCcw size={10} />
                            Return
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {booksToDisplay.length > 0 && (
            <div style={{ padding: "10px 18px", borderTop: `1px solid ${C.border}`, background: C.bgDeep }}>
              <p style={{ fontSize: 10, color: C.textMuted, margin: 0, fontWeight: 600 }}>
                Showing <span style={{ color: C.textPrimary, fontWeight: 800 }}>{booksToDisplay.length}</span>{" "}
                {filter === "borrowed" ? "active" : "overdue"}{" "}
                {booksToDisplay.length === 1 ? "record" : "records"}
              </p>
            </div>
          )}
        </div>
      </main>

      {returnBookPopup && <ReturnBookPopup borrowId={borrowedBookId} email={email} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
};

export default Catalog;