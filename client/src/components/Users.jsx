import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../store/slices/userSlice";
import { Users as UsersIcon, Shield, User, Search, X } from "lucide-react";

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

const Users = () => {
  const dispatch = useDispatch();
  const { allUsers = [], loading } = useSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
    setTimeout(() => setMounted(true), 60);
  }, [dispatch]);

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  const filtered = allUsers.filter(
    (u) =>
      !searchQuery.trim() ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const admins = allUsers.filter((u) => u.role === "admin").length;
  const members = allUsers.filter((u) => u.role !== "admin").length;
  const verified = allUsers.filter((u) => u.accountVerified).length;

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
          Management
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
          User Base
        </h1>
        <p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>
          All registered members and administrators
        </p>
      </div>

      {/* ── Stat chips row ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s ease 80ms, transform 0.4s ease 80ms",
        }}
      >
        {[
          { label: "Total Users", value: allUsers.length, color: C.textPrimary, bg: C.bgCard },
          { label: "Admins", value: admins, color: C.dark, bg: C.dark, light: true },
          { label: "Members", value: members, color: C.orange, bg: "#fff7ed", border: "rgba(249,115,22,0.2)" },
          { label: "Verified", value: verified, color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
        ].map(({ label, value, color, bg, light, border }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 16px",
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
                color: light ? "#fff" : color,
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
                color: light ? "rgba(255,255,255,0.6)" : C.textMuted,
              }}
            >
              {label}
            </span>
          </div>
        ))}

        {/* Spacer + Search */}
        <div style={{ flex: 1, minWidth: 180, maxWidth: 300, marginLeft: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "9px 14px",
              background: searchFocused ? C.bgCard : C.bgDeep,
              border: `1.5px solid ${searchFocused ? C.orange : C.border}`,
              borderRadius: 12,
              boxShadow: searchFocused ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <Search size={13} color={searchFocused ? C.orange : C.textFaint} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search users…"
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.textFaint, display: "flex" }}
              >
                <X size={13} />
              </button>
            )}
          </div>
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
                {["#", "User", "Email", "Role", "Joined", "Books", "Status"].map((h) => (
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
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 0", textAlign: "center" }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        border: `2px solid ${C.border}`,
                        borderTopColor: C.orange,
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto",
                      }}
                    />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 0", textAlign: "center" }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: C.bgDeep,
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <UsersIcon size={20} color={C.textFaint} />
                    </div>
                    <p style={{ fontSize: 12, color: C.textMuted, margin: 0, fontWeight: 600 }}>
                      {searchQuery ? "No users match your search" : "No users found"}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, index) => (
                  <tr
                    key={user._id}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      transition: "background 0.15s",
                      cursor: "default",
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

                    {/* User */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            overflow: "hidden",
                            flexShrink: 0,
                            border: `2px solid rgba(249,115,22,0.15)`,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          }}
                        >
                          {user?.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt={user.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                background:
                                  user.role === "admin"
                                    ? C.dark
                                    : `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>
                                {getInitials(user.name)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: C.textPrimary,
                            margin: 0,
                            fontFamily: "Georgia, serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.name}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td
                      style={{
                        padding: "14px 18px",
                        fontSize: 11,
                        color: C.textMuted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email}
                    </td>

                    {/* Role */}
                    <td style={{ padding: "14px 18px" }}>
                      {user.role === "admin" ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            background: C.dark,
                            color: "#fff",
                            borderRadius: 8,
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Shield size={9} color={C.orange} />
                          Admin
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
                          <User size={9} color={C.orange} />
                          Member
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td
                      style={{
                        padding: "14px 18px",
                        fontSize: 11,
                        color: C.textMuted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Books */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: C.textPrimary,
                            fontFamily: "Georgia, serif",
                          }}
                        >
                          {user.activeBorrows ?? 0}
                        </span>
                        <span style={{ fontSize: 9, color: C.textFaint, fontWeight: 600 }}>
                          borrowed
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 18px" }}>
                      {user.accountVerified ? (
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
                              boxShadow: "0 0 5px rgba(34,197,94,0.5)",
                              animation: "pulse 2s infinite",
                            }}
                          />
                          Verified
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            background: C.bgDeep,
                            color: C.textMuted,
                            border: `1px solid ${C.border}`,
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
                              background: C.textFaint,
                              display: "inline-block",
                            }}
                          />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div
            style={{
              padding: "10px 18px",
              borderTop: `1px solid ${C.border}`,
              background: C.bgDeep,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: 10, color: C.textMuted, margin: 0, fontWeight: 600 }}>
              Showing{" "}
              <span style={{ color: C.textPrimary, fontWeight: 800 }}>{filtered.length}</span>{" "}
              of{" "}
              <span style={{ color: C.textPrimary, fontWeight: 800 }}>{allUsers.length}</span>{" "}
              users
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  fontSize: 10,
                  color: C.orange,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: "system-ui",
                }}
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </main>
  );
};

export default Users;