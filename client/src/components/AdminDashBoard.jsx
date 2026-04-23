import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, LineElement, PointElement, ArcElement,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBorrows } from "../store/slices/borrowSlice";
import { getUsers } from "../store/slices/userSlice";
import {
  Users, BookOpen, ShieldCheck, BookMarked,
  RotateCcw, TrendingUp, Sparkles,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

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

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { allUsers = [] } = useSelector((state) => state.users);
  const { books = [] } = useSelector((state) => state.books);
  const { allBorrows = [] } = useSelector((state) => state.borrow);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBorrows());
    dispatch(getUsers());
    setTimeout(() => setMounted(true), 60);
  }, [dispatch]);

  const totalUsers    = allUsers.filter((u) => u.role === "user").length;
  const totalAdmin    = allUsers.filter((u) => u.role === "admin").length;
  const totalBooks    = books.length;
  const totalBorrowed = allBorrows.filter((b) => !b.returned).length;
  const totalReturned = allBorrows.filter((b) => b.returned).length;
  const totalMembers  = totalUsers + totalAdmin;
  const adminPct      = totalMembers > 0 ? Math.round((totalAdmin / totalMembers) * 100) : 0;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

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

  const pieData = {
    labels: ["Regular Users", "Admins"],
    datasets: [{
      data: totalMembers > 0 ? [totalUsers, totalAdmin] : [1, 0],
      backgroundColor: [C.dark, C.orange],
      borderColor: [C.bgCard, C.bgCard],
      borderWidth: 3,
      hoverOffset: 6,
    }],
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
          <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: C.orange, margin: 0, marginBottom: 6 }}>
            Admin Panel
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.textPrimary, fontFamily: "Georgia, serif", margin: 0, letterSpacing: "-0.02em" }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0", letterSpacing: "0.02em" }}>
            Monitor your library system at a glance
          </p>
        </div>

        {/* Admin greeting chip */}
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
              <img src={user.avatar.url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
            <p style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif" }}>
              {user?.name?.split(" ")[0] || "Admin"}
            </p>
            <p style={{ fontSize: 9, color: C.textMuted, margin: 0 }}>Administrator</p>
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
        {/* Total Users */}
        <div style={cardStyle(80)}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={16} color="#6366f1" />
            </div>
            <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint }}>Members</span>
          </div>
          <p style={{ fontSize: 36, fontWeight: 900, color: C.textPrimary, margin: "14px 0 2px", fontFamily: "Georgia, serif", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {totalUsers}
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0, fontWeight: 600 }}>Total Users</p>
          <div style={{ marginTop: 14, height: 3, background: C.bgDeep, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(totalUsers * 2, 100)}%`, background: "#6366f1", borderRadius: 4, transition: "width 1s ease" }} />
          </div>
        </div>

        {/* Total Admins */}
        <div style={cardStyle(140)}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(249,115,22,0.25)",
              }}
            >
              <ShieldCheck size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint }}>Staff</span>
          </div>
          <p style={{ fontSize: 36, fontWeight: 900, color: C.textPrimary, margin: "14px 0 2px", fontFamily: "Georgia, serif", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {totalAdmin}
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0, fontWeight: 600 }}>Total Admins</p>
          <div style={{ marginTop: 14, height: 3, background: C.bgDeep, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(totalAdmin * 10, 100)}%`, background: C.orange, borderRadius: 4, transition: "width 1s ease" }} />
          </div>
        </div>

        {/* Total Books */}
        <div style={cardStyle(200)}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: C.bgDeep, border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookMarked size={16} color={C.textPrimary} />
            </div>
            <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: C.textFaint }}>Catalog</span>
          </div>
          <p style={{ fontSize: 36, fontWeight: 900, color: C.textPrimary, margin: "14px 0 2px", fontFamily: "Georgia, serif", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {totalBooks}
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0, fontWeight: 600 }}>Total Books</p>
          <div style={{ marginTop: 14, height: 3, background: C.bgDeep, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: totalBooks > 0 ? "100%" : "0%", background: `linear-gradient(90deg, ${C.dark}, ${C.orange})`, borderRadius: 4, transition: "width 1s ease" }} />
          </div>
        </div>
      </div>

      {/* ── Main content row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 16, alignItems: "start" }}>

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
          <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(249,115,22,0.1)" }} />
          <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(249,115,22,0.06)" }} />
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 48, lineHeight: 0.8, color: C.orange, fontFamily: "Georgia, serif", display: "block", marginBottom: 10, opacity: 0.6 }}>"</span>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", margin: 0, lineHeight: 1.6, letterSpacing: "-0.01em" }}>
              Embarking on the journey of reading fosters personal growth, nurturing a path towards excellence.
            </p>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
            <p style={{ fontSize: 10, color: C.orange, fontWeight: 700, margin: 0, letterSpacing: "0.08em" }}>— ShelfSync Team</p>
            <div style={{ padding: "4px 10px", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 6 }}>
              <Sparkles size={11} color={C.orange} />
            </div>
          </div>
        </div>

        {/* ── Borrow activity card ── */}
        <div
          style={{
            ...cardStyle(320),
            background: C.bgDeep,
            border: `1.5px dashed rgba(249,115,22,0.3)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 180,
            overflow: "hidden",
          }}
        >
          <div>
            <div
              style={{
                width: 44, height: 44, borderRadius: 12, background: C.dark,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <BookOpen size={18} color="#fff" />
            </div>
            <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: C.orange, margin: "0 0 6px" }}>
              Circulation
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif" }}>Borrow Activity</p>
            <p style={{ fontSize: 11, color: C.textMuted, margin: "6px 0 0" }}>Track what's checked out vs returned</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
            <div style={{ background: C.dark, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <BookOpen size={10} color="#888" />
                <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", margin: 0 }}>Out</p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, fontFamily: "Georgia, serif" }}>{totalBorrowed}</p>
            </div>
            <div style={{ background: "#fff7ed", borderRadius: 12, padding: "12px 14px", border: `1px solid rgba(249,115,22,0.15)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <RotateCcw size={10} color={C.orange} />
                <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: C.orange, margin: 0 }}>Back</p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: C.orange, margin: 0, fontFamily: "Georgia, serif" }}>{totalReturned}</p>
            </div>
          </div>
        </div>

        {/* ── Donut chart ── */}
        <div
          style={{
            ...cardStyle(380),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gridRow: "span 2",
          }}
        >
          <div style={{ width: "100%", marginBottom: 16 }}>
            <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: C.textFaint, margin: 0 }}>Analytics</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, margin: "4px 0 0", fontFamily: "Georgia, serif" }}>User Distribution</p>
          </div>

          <div style={{ width: 160, height: 160, position: "relative", flexShrink: 0 }}>
            <Pie data={pieData} options={pieOptions} />
            {totalMembers > 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <p style={{ fontSize: 22, fontWeight: 900, color: C.textPrimary, margin: 0, fontFamily: "Georgia, serif", lineHeight: 1 }}>{adminPct}%</p>
                <p style={{ fontSize: 8, color: C.textMuted, margin: "3px 0 0", letterSpacing: "0.1em" }}>admins</p>
              </div>
            )}
            {totalMembers === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <p style={{ fontSize: 9, color: C.textFaint, textAlign: "center" }}>No data yet</p>
              </div>
            )}
          </div>

          <div style={{ width: "100%", marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Regular Users",        count: totalUsers,    color: C.dark },
              { label: "Admins",               count: totalAdmin,    color: C.orange },
              { label: "Books in Circulation", count: totalBorrowed, color: "#6366f1" },
              { label: "Books Returned",       count: totalReturned, color: C.green },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px", background: C.bgDeep, borderRadius: 10, border: `1px solid ${C.border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.textPrimary, fontFamily: "Georgia, serif" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Admin profile card ── */}
        <div style={{ ...cardStyle(440), gridColumn: "span 2" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: C.textFaint, margin: 0 }}>Signed In</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: C.textPrimary, margin: "4px 0 0", fontFamily: "Georgia, serif" }}>Admin Profile</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 1.4s ease-in-out infinite" }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#15803d" }}>Online</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: C.bgDeep, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0, border: `2px solid rgba(249,115,22,0.25)` }}>
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 18, fontWeight: 900, fontFamily: "Georgia, serif" }}>{initials}</span>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: C.orange, margin: "0 0 3px" }}>Administrator</p>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: C.textPrimary, fontFamily: "Georgia, serif", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name || "Administrator"}
              </h2>
              <p style={{ fontSize: 11, color: C.textMuted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
            </div>

            {/* Quick stat chips */}
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {[
                { val: totalUsers,    label: "Users",  color: C.textPrimary },
                { val: totalBooks,    label: "Books",  color: C.orange },
                { val: totalBorrowed, label: "Active", color: "#6366f1" },
              ].map(({ val, label, color }) => (
                <div key={label} style={{ padding: "8px 14px", background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 10, textAlign: "center" }}>
                  <p style={{ fontSize: 16, fontWeight: 900, color, fontFamily: "Georgia, serif", margin: 0, lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: 8, color: C.textFaint, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "3px 0 0" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </main>
  );
};

export default AdminDashboard;