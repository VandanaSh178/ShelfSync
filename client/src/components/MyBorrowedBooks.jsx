import React, { useState, useEffect } from "react";
import { BookA, Eye, BookOpen, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBorrows } from "../store/slices/borrowSlice";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
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

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { myBorrows = [] } = useSelector((state) => state.borrow || {});
  const { readBookPopup } = useSelector((state) => state.popups || {});
  const [filter, setFilter] = useState("active");
  const [readBook, setReadBook] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(fetchMyBorrows());
    setTimeout(() => setMounted(true), 60);
  }, [dispatch]);

  const openReadBookPopup = (record) => {
    setReadBook(record.book || {});
    dispatch(toggleReadBookPopup());
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isOverdue = (record) =>
    !record.returned && new Date(record.dueDate) < new Date();

  const returnedBooks = myBorrows.filter((r) => r.returned === true);
  const activeBooks = myBorrows.filter((r) => r.returned === false);
  const overdueBooks = activeBooks.filter((r) => isOverdue(r));
  const booksToDisplay = filter === "returned" ? returnedBooks : activeBooks;

  const tabs = [
    { key: "active", label: "Active", count: activeBooks.length },
    { key: "returned", label: "Returned", count: returnedBooks.length },
  ];

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
          <p
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: C.orange,
              margin: "0 0 6px",
            }}
          >
            Personal
          </p>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: C.textPrimary,
              fontFamily: "Georgia, serif",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            My Borrowed Books
          </h1>
          <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>
            Track your current and past borrowing activity
          </p>
        </div>

        {/* ── Stat chips + tabs row ── */}
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
              { label: "Total", value: myBorrows.length, color: C.textPrimary, bg: C.bgCard },
              { label: "Active", value: activeBooks.length, color: C.orange, bg: "#fff7ed", border: "rgba(249,115,22,0.2)" },
              { label: "Returned", value: returnedBooks.length, color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
              ...(overdueBooks.length > 0
                ? [{ label: "Overdue", value: overdueBooks.length, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" }]
                : []),
            ].map(({ label, value, color, bg, border }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "8px 14px",
                  background: bg,
                  border: `1.5px solid ${border || C.border}`,
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color,
                    fontFamily: "Georgia, serif",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: C.textMuted,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Toggle tabs */}
          <div
            style={{
              display: "flex",
              background: C.bgDeep,
              border: `1.5px solid ${C.border}`,
              borderRadius: 12,
              padding: 4,
              gap: 3,
            }}
          >
            {tabs.map(({ key, label, count }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "7px 16px",
                    borderRadius: 9,
                    border: active ? `1.5px solid rgba(249,115,22,0.2)` : "1.5px solid transparent",
                    background: active ? C.bgCard : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: active ? C.textPrimary : C.textMuted,
                      letterSpacing: "0.02em",
                      transition: "color 0.2s",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: 6,
                      background: active ? C.orange : C.border,
                      color: active ? "#fff" : C.textMuted,
                      transition: "all 0.2s",
                    }}
                  >
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
                  {["#", "Book", "Borrowed On", "Due Date", "Status", "View"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 18px",
                        textAlign: "left",
                        fontSize: 8,
                        fontWeight: 800,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: C.textFaint,
                        fontFamily: "system-ui, sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.length > 0 ? (
                  booksToDisplay.map((record, index) => {
                    const overdue = isOverdue(record);
                    return (
                      <tr
                        key={record._id}
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = C.bgDeep)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {/* # */}
                        <td
                          style={{
                            padding: "14px 18px",
                            fontSize: 10,
                            color: C.textFaint,
                            fontFamily: "Georgia, serif",
                            fontWeight: 700,
                            width: 40,
                          }}
                        >
                          {index + 1}
                        </td>

                        {/* Book */}
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                              style={{
                                width: 36,
                                height: 50,
                                borderRadius: 7,
                                overflow: "hidden",
                                flexShrink: 0,
                                border: `1px solid ${C.border}`,
                                boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
                              }}
                            >
                              {record.book?.coverImage?.url ? (
                                <img
                                  src={record.book.coverImage.url}
                                  alt="cover"
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentNode.style.background = C.dark;
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    background: C.dark,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <BookOpen size={12} color="#fff" />
                                </div>
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: C.textPrimary,
                                  margin: 0,
                                  fontFamily: "Georgia, serif",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 200,
                                }}
                              >
                                {record.book?.title || "Unknown Title"}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: C.textMuted,
                                  margin: "3px 0 0",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: 200,
                                }}
                              >
                                {record.book?.author || "Unknown Author"}
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
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: overdue ? "#dc2626" : C.textMuted,
                            }}
                          >
                            {overdue && (
                              <AlertCircle
                                size={10}
                                color="#dc2626"
                                style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }}
                              />
                            )}
                            {formatDate(record.dueDate)}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: "14px 18px" }}>
                          {record.returned ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                background: "#f0fdf4",
                                color: "#15803d",
                                border: "1px solid #bbf7d0",
                                borderRadius: 8,
                                fontSize: 9,
                                fontWeight: 800,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: C.green,
                                  display: "inline-block",
                                }}
                              />
                              Returned
                            </span>
                          ) : overdue ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                background: "#fef2f2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: 8,
                                fontSize: 9,
                                fontWeight: 800,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#dc2626",
                                  display: "inline-block",
                                  animation: "pulse 1.5s infinite",
                                }}
                              />
                              Overdue
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 5,
                                padding: "4px 10px",
                                background: "#fff7ed",
                                color: C.orange,
                                border: `1px solid rgba(249,115,22,0.2)`,
                                borderRadius: 8,
                                fontSize: 9,
                                fontWeight: 800,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: C.orange,
                                  display: "inline-block",
                                  animation: "pulse 2s infinite",
                                }}
                              />
                              In Use
                            </span>
                          )}
                        </td>

                        {/* View */}
                        <td style={{ padding: "14px 18px" }}>
                          <button
                            onClick={() => openReadBookPopup(record)}
                            title="View Details"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 9,
                              border: `1.5px solid ${C.border}`,
                              background: C.bgDeep,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                              color: C.textMuted,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#fff7ed";
                              e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
                              e.currentTarget.style.color = C.orange;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = C.bgDeep;
                              e.currentTarget.style.borderColor = C.border;
                              e.currentTarget.style.color = C.textMuted;
                            }}
                          >
                            <Eye size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: "60px 0", textAlign: "center" }}>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          background: C.bgDeep,
                          border: `1.5px solid ${C.border}`,
                          borderRadius: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 14px",
                        }}
                      >
                        <BookA size={22} color={C.textFaint} />
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: C.textMuted,
                          margin: 0,
                          fontWeight: 700,
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        No {filter === "returned" ? "returned" : "active"} books found
                      </p>
                      <p style={{ fontSize: 10, color: C.textFaint, margin: "5px 0 0" }}>
                        {filter === "active"
                          ? "Browse the catalog to borrow a book"
                          : "Books you return will appear here"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {booksToDisplay.length > 0 && (
            <div
              style={{
                padding: "10px 18px",
                borderTop: `1px solid ${C.border}`,
                background: C.bgDeep,
              }}
            >
              <p style={{ fontSize: 10, color: C.textMuted, margin: 0, fontWeight: 600 }}>
                Showing{" "}
                <span style={{ color: C.textPrimary, fontWeight: 800 }}>{booksToDisplay.length}</span>{" "}
                {filter === "returned" ? "returned" : "active"}{" "}
                {booksToDisplay.length === 1 ? "book" : "books"}
              </p>
            </div>
          )}
        </div>
      </main>

      {readBookPopup && <ReadBookPopup book={readBook} />}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
};

export default MyBorrowedBooks;