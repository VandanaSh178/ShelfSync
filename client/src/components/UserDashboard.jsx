import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyBorrows, fetchBorrowHistory } from "../store/slices/borrowSlice";
import {
  BookOpen,
  RotateCcw,
  Library,
  Sparkles,
  TrendingUp,
  Clock,
  BookMarked,
  ChevronRight,
  Calendar,
} from "lucide-react";

ChartJS.register(Tooltip, Legend, ArcElement);

// ── Color tokens matching SideBar & Header ──
const C = {
  bg: "#faf6f0",
  bgDeep: "#f5ede0",
  bgCard: "#ffffff",
  border: "#e8ddd0",
  orange: "#f97316",
  orangeDeep: "#ea580c",
  orangeFaint: "rgba(249,115,22,0.08)",
  textPrimary: "#2d1f0e",
  textMuted: "#a89070",
  textFaint: "#c4a882",
  dark: "#1a1612",
  green: "#22c55e",
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { myBorrows = [], borrowHistory = [] } = useSelector((state) => state.borrow);
  const { user } = useSelector((state) => state.auth);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(fetchMyBorrows());
    dispatch(fetchBorrowHistory());
    setTimeout(() => setMounted(true), 60);
  }, [dispatch]);

  useEffect(() => {
    setTotalBorrowedBooks(myBorrows.filter((b) => b.returned === false).length);
    setTotalReturnedBooks(borrowHistory.filter((b) => b.returned === true).length);
  }, [myBorrows, borrowHistory]);

  const totalBooks = totalBorrowedBooks + totalReturnedBooks;
  const borrowedPct = totalBooks > 0 ? Math.round((totalBorrowedBooks / totalBooks) * 100) : 0;

  const pieData = {
    labels: ["Currently Borrowed", "Returned"],
    datasets: [
      {
        data: totalBooks > 0 ? [totalBorrowedBooks, totalReturnedBooks] : [1, 0],
        backgroundColor: [C.dark, C.orange],
        borderColor: [C.bgCard, C.bgCard],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: C.dark,
        titleColor: "#fff",
        bodyColor: C.textFaint,
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: "Georgia, serif", size: 12 },
        bodyFont: { family: "system-ui, sans-serif", size: 11 },
      },
    },
    cutout: "62%",
  };

  // Recently borrowed (last 3)
  const recentBorrows = [...myBorrows]
    .filter((b) => b.returned === false)
    .slice(0, 3);

  const cardStyle = (delay = 0) => ({
    background: C.bgCard,
    border: `1.5px solid ${C.border}`,
    borderRadius: 16,
    padding: "20px 22px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
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
          marginBottom: 28,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: C.orange,
              margin: 0,
              marginBottom: 6,
            }}
          >
            Overview
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
            My Dashboard
          </h1>
          <p
            style={{
              fontSize: 11,
              color: C.textMuted,
              margin: "5px 0 0",
              letterSpacing: "0.02em",
            }}
          >
            Track your reading activity and borrowed books
          </p>
        </div>

        {/* User greeting chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            background: C.bgCard,
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              overflow: "hidden",
              border: `2px solid rgba(249,115,22,0.25)`,
              flexShrink: 0,
            }}
          >
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>{initials}</span>
              </div>
            )}
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.textPrimary,
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              {user?.name?.split(" ")[0] || "Reader"}
            </p>
            <p style={{ fontSize: 9, color: C.textMuted, margin: 0 }}>Active Member</p>
          </div>
        </div>
      </div>

      {/* ── Stat cards row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Currently Borrowed */}
        <div style={cardStyle(80)}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: C.dark,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <BookOpen size={16} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.textFaint,
              }}
            >
              Active
            </span>
          </div>
          <p
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: C.textPrimary,
              margin: "14px 0 2px",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {totalBorrowedBooks}
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0, fontWeight: 600 }}>
            Currently Borrowed
          </p>
          <div
            style={{
              marginTop: 14,
              height: 3,
              background: C.bgDeep,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(totalBorrowedBooks * 10, 100)}%`,
                background: C.dark,
                borderRadius: 4,
                transition: "width 1s ease",
              }}
            />
          </div>
        </div>

        {/* Total Returned */}
        <div style={cardStyle(140)}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
              }}
            >
              <RotateCcw size={16} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.textFaint,
              }}
            >
              Returned
            </span>
          </div>
          <p
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: C.textPrimary,
              margin: "14px 0 2px",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {totalReturnedBooks}
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0, fontWeight: 600 }}>
            Total Returned
          </p>
          <div
            style={{
              marginTop: 14,
              height: 3,
              background: C.bgDeep,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(totalReturnedBooks * 10, 100)}%`,
                background: C.orange,
                borderRadius: 4,
                transition: "width 1s ease",
              }}
            />
          </div>
        </div>

        {/* Total Activity */}
        <div style={cardStyle(200)}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: C.bgDeep,
                border: `1.5px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={16} color={C.orange} />
            </div>
            <span
              style={{
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.textFaint,
              }}
            >
              Total
            </span>
          </div>
          <p
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: C.textPrimary,
              margin: "14px 0 2px",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {totalBooks}
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0, fontWeight: 600 }}>
            Total Transactions
          </p>
          <div
            style={{
              marginTop: 14,
              height: 3,
              background: C.bgDeep,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: totalBooks > 0 ? "100%" : "0%",
                background: `linear-gradient(90deg, ${C.dark}, ${C.orange})`,
                borderRadius: 4,
                transition: "width 1s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Main content row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 300px",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* ── Quote card ── */}
        <div
          style={{
            ...cardStyle(260),
            background: C.dark,
            position: "relative",
            overflow: "hidden",
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(249,115,22,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(249,115,22,0.06)",
            }}
          />

          <div style={{ position: "relative" }}>
            <span
              style={{
                fontSize: 48,
                lineHeight: 0.8,
                color: C.orange,
                fontFamily: "Georgia, serif",
                display: "block",
                marginBottom: 10,
                opacity: 0.6,
              }}
            >
              "
            </span>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "Georgia, serif",
                margin: 0,
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
              }}
            >
              A reader lives a thousand lives before he dies.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: C.orange,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "0.08em",
                }}
              >
                — ShelfSync Team
              </p>
            </div>
            <div
              style={{
                padding: "4px 10px",
                background: "rgba(249,115,22,0.15)",
                border: "1px solid rgba(249,115,22,0.2)",
                borderRadius: 6,
              }}
            >
              <Sparkles size={11} color={C.orange} />
            </div>
          </div>
        </div>

        {/* ── Browse catalog card ── */}
        <div
          style={{
            ...cardStyle(320),
            background: C.bgDeep,
            border: `1.5px dashed rgba(249,115,22,0.3)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 180,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef3e8";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.bgDeep;
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          }}
        >
          <div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#fff7ed",
                border: `1.5px solid rgba(249,115,22,0.2)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Library size={18} color={C.orange} />
            </div>
            <p
              style={{
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: C.orange,
                margin: "0 0 6px",
              }}
            >
              Explore
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: C.textPrimary,
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              Browse Book Catalog
            </p>
            <p style={{ fontSize: 11, color: C.textMuted, margin: "6px 0 0" }}>
              Discover new titles available for borrowing
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.orange }}>Go to Catalog</span>
            <ChevronRight size={13} color={C.orange} />
          </div>
        </div>

        {/* ── Pie chart ── */}
        <div
          style={{
            ...cardStyle(380),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            gridRow: "span 2",
          }}
        >
          <div style={{ width: "100%", marginBottom: 16 }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: C.textFaint,
                margin: 0,
              }}
            >
              Analytics
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: C.textPrimary,
                margin: "4px 0 0",
                fontFamily: "Georgia, serif",
              }}
            >
              Borrow Overview
            </p>
          </div>

          {/* Donut chart */}
          <div style={{ width: 160, height: 160, position: "relative", flexShrink: 0 }}>
            <Pie data={pieData} options={pieOptions} />
            {totalBooks > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: C.textPrimary,
                    margin: 0,
                    fontFamily: "Georgia, serif",
                    lineHeight: 1,
                  }}
                >
                  {borrowedPct}%
                </p>
                <p style={{ fontSize: 8, color: C.textMuted, margin: "3px 0 0", letterSpacing: "0.1em" }}>
                  borrowed
                </p>
              </div>
            )}
            {totalBooks === 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <p style={{ fontSize: 9, color: C.textFaint, textAlign: "center" }}>No data yet</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div
            style={{
              width: "100%",
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              { label: "Currently Borrowed", count: totalBorrowedBooks, color: C.dark },
              { label: "Returned", count: totalReturnedBooks, color: C.orange },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: C.bgDeep,
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{label}</span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: C.textPrimary,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Currently reading / recent borrows ── */}
        <div
          style={{
            ...cardStyle(440),
            gridColumn: "span 2",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: C.textFaint,
                  margin: 0,
                }}
              >
                In Progress
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: C.textPrimary,
                  margin: "4px 0 0",
                  fontFamily: "Georgia, serif",
                }}
              >
                Currently Borrowed
              </p>
            </div>
            <div
              style={{
                padding: "5px 10px",
                background: C.bgDeep,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: C.textMuted }}>
                {totalBorrowedBooks} active
              </span>
            </div>
          </div>

          {recentBorrows.length === 0 ? (
            <div
              style={{
                padding: "32px 20px",
                textAlign: "center",
                background: C.bgDeep,
                borderRadius: 12,
                border: `1px dashed ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: C.bgCard,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <BookMarked size={18} color={C.textFaint} />
              </div>
              <p style={{ fontSize: 12, color: C.textMuted, margin: 0, fontWeight: 600 }}>
                No books currently borrowed
              </p>
              <p style={{ fontSize: 10, color: C.textFaint, margin: "4px 0 0" }}>
                Visit the catalog to find your next read
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentBorrows.map((book, i) => (
                <div
                  key={book._id || i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 14px",
                    background: C.bgDeep,
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f0e6d8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.bgDeep)}
                >
                  {/* Book cover */}
                  <div
                    style={{
                      width: 36,
                      height: 50,
                      borderRadius: 6,
                      overflow: "hidden",
                      flexShrink: 0,
                      border: `1px solid ${C.border}`,
                      boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {book.book?.coverImage?.url ? (
                      <img
                        src={book.book.coverImage.url}
                        alt={book.book?.title}
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

                  {/* Book info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                      }}
                    >
                      {book.book?.title || "Unknown Title"}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: C.textMuted,
                        margin: "3px 0 0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {book.book?.author || "Unknown Author"}
                    </p>
                  </div>

                  {/* Due date */}
                  {book.dueDate && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "4px 10px",
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={10} color={C.textFaint} />
                      <span style={{ fontSize: 9, color: C.textMuted, fontWeight: 600 }}>
                        {new Date(book.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {/* Status dot */}
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: C.green,
                      flexShrink: 0,
                      boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keyframe for spin */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
};

export default UserDashboard;