import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { logoutUser } from "../store/slices/authSlice";
import { fetchBooks } from "../store/slices/bookSlice";
import { Settings, Bell, ChevronDown, BookOpen, LogOut, User, Search, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "../popups/ProfilePopup";
import { fetchNotifications, markAllNotificationsRead, deleteNotification } from "../store/slices/notificationSlice";

const typeStyles = {
  book_added:    { dot: "#10b981", label: "Added",    bg: "#f0fdf4", text: "#065f46" },
  book_deleted:  { dot: "#ef4444", label: "Deleted",  bg: "#fef2f2", text: "#991b1b" },
  book_borrowed: { dot: "#3b82f6", label: "Borrowed", bg: "#eff6ff", text: "#1e40af" },
  book_returned: { dot: "#8b5cf6", label: "Returned", bg: "#f5f3ff", text: "#5b21b6" },
  overdue:       { dot: "#f97316", label: "Overdue",  bg: "#fff7ed", text: "#9a3412" },
};

const Header = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { books = [] } = useSelector((state) => state.books);
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  const [dateTime, setDateTime] = useState({ time: "", date: "" });
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => { dispatch(fetchBooks()); }, [dispatch]);
  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      const m = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setDateTime({
        time: `${h}:${m} ${ampm}`,
        date: now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = books.filter((b) =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, books]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const isAdmin = user?.role === "admin";

  // Inline styles matching landing/login page
  const styles = {
    header: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      fontFamily: "'Georgia', serif",
      background: scrolled ? "rgba(250,246,240,0.98)" : "rgba(250,246,240,0.92)",
      backdropFilter: "blur(20px)",
      boxShadow: scrolled
        ? "0 1px 0 0 #e8ddd0, 0 4px 24px -4px rgba(0,0,0,0.06)"
        : "0 1px 0 0 #e8ddd0",
      transition: "all 0.4s ease",
    },
    accentBar: {
      height: 3,
      background: "linear-gradient(90deg, #f97316, #ea580c 40%, #c2410c)",
    },
    inner: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      height: 64,
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: 20,
    },
    logoMark: {
      position: "relative",
      width: 38,
      height: 38,
      background: "#1a1612",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      flexShrink: 0,
    },
    logoDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 10,
      height: 10,
      background: "#f97316",
      borderRadius: "50%",
      border: "2px solid #faf6f0",
    },
    logoText: {
      display: "flex",
      flexDirection: "column",
    },
    logoName: {
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#1a1612",
      lineHeight: 1,
      fontFamily: "'Georgia', serif",
    },
    logoSub: {
      fontSize: 8,
      color: "#a89070",
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      marginTop: 3,
      lineHeight: 1,
      fontFamily: "system-ui, sans-serif",
    },
    divider: {
      width: 1,
      height: 28,
      background: "#e8ddd0",
    },
    clock: {
      display: "flex",
      flexDirection: "column",
    },
    clockTime: {
      fontSize: 13,
      fontWeight: 700,
      color: "#2d1f0e",
      fontFamily: "'Georgia', serif",
      lineHeight: 1,
      letterSpacing: "-0.02em",
    },
    clockDate: {
      fontSize: 8,
      color: "#a89070",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      marginTop: 3,
      lineHeight: 1,
      fontFamily: "system-ui, sans-serif",
    },
    searchWrapper: {
      flex: 1,
      maxWidth: 360,
      margin: "0 32px",
      position: "relative",
    },
    searchBox: (focused) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      background: focused ? "#fff" : "#f3ece3",
      border: `1.5px solid ${focused ? "#f97316" : "#e0d3c0"}`,
      borderRadius: 10,
      padding: "9px 14px",
      transition: "all 0.2s ease",
      boxShadow: focused ? "0 0 0 3px rgba(249,115,22,0.1)" : "none",
    }),
    searchInput: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      fontSize: 12,
      color: "#2d1f0e",
      fontFamily: "system-ui, sans-serif",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    roleBadge: (isAdmin) => ({
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 10px",
      borderRadius: 8,
      border: `1.5px solid ${isAdmin ? "#2d1f0e" : "#d1fae5"}`,
      background: isAdmin ? "#1a1612" : "#f0fdf4",
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: isAdmin ? "#fff" : "#065f46",
      fontFamily: "system-ui, sans-serif",
    }),
    iconBtn: (active) => ({
      position: "relative",
      padding: 8,
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: active ? "#fff7ed" : "transparent",
      color: active ? "#f97316" : "#a89070",
      transition: "all 0.2s ease",
    }),
    notifBadge: {
      position: "absolute",
      top: 6,
      right: 6,
      minWidth: 16,
      height: 16,
      background: "#f97316",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 8,
      fontWeight: 800,
      color: "#fff",
      fontFamily: "system-ui, sans-serif",
      boxShadow: "0 2px 6px rgba(249,115,22,0.4)",
    },
    // Dropdown styles
    dropdown: {
      position: "absolute",
      right: 0,
      top: "calc(100% + 8px)",
      background: "#faf6f0",
      border: "1.5px solid #e8ddd0",
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
      zIndex: 999,
      overflow: "hidden",
    },
    notifHeader: {
      padding: "14px 16px",
      borderBottom: "1px solid #e8ddd0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#f5ede0",
    },
    profileHeader: {
      padding: "20px 16px",
      background: "#1a1612",
      position: "relative",
      overflow: "hidden",
    },
  };

  return (
    <>
      <header style={styles.header}>
        {/* Accent line */}
        <div style={styles.accentBar} />

        <div style={styles.inner}>

          {/* ── LEFT ── */}
          <div style={styles.leftSection}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={styles.logoMark}>
                <BookOpen size={16} color="#fff" />
                <div style={styles.logoDot} />
              </div>
              <div style={styles.logoText}>
                <span style={styles.logoName}>ShelfSync</span>
                <span style={styles.logoSub}>Library OS</span>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.clock}>
              <span style={styles.clockTime}>{dateTime.time}</span>
              <span style={styles.clockDate}>{dateTime.date}</span>
            </div>
          </div>

          {/* ── CENTER: Search ── */}
          <div style={styles.searchWrapper}>
            <div style={styles.searchBox(searchFocused)}>
              <Search size={14} color={searchFocused ? "#f97316" : "#c4a882"} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search books, authors…"
                style={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#c4a882", display: "flex" }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: "#faf6f0",
                border: "1.5px solid #e8ddd0",
                borderRadius: 14,
                boxShadow: "0 16px 48px rgba(0,0,0,0.1)",
                zIndex: 999,
                overflow: "hidden",
              }}>
                <div style={{ padding: "8px 14px 6px", borderBottom: "1px solid #f0e8d8" }}>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a89070", margin: 0, fontFamily: "system-ui" }}>
                    Results
                  </p>
                </div>
                {searchResults.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => { setSearchQuery(""); setSearchResults([]); setSelectedComponent?.("books"); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5ede0"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={book.coverImage?.url || "https://placehold.co/28x38"}
                      style={{ width: 28, height: 38, objectFit: "cover", borderRadius: 6, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
                      onError={(e) => { e.target.src = "https://placehold.co/28x38"; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#2d1f0e", margin: 0, fontFamily: "'Georgia', serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {book.title}
                      </p>
                      <p style={{ fontSize: 10, color: "#a89070", margin: 0, marginTop: 2, fontFamily: "system-ui" }}>
                        {book.author}
                      </p>
                    </div>
                    <ChevronDown size={12} color="#c4a882" style={{ transform: "rotate(-90deg)" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div style={styles.rightSection}>

            {/* Role badge */}
            <div style={styles.roleBadge(isAdmin)}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: isAdmin ? "#f97316" : "#10b981",
                animation: "pulse 2s infinite",
              }} />
              {isAdmin ? "Admin" : "Member"}
            </div>

            <div style={styles.divider} />

            {/* Notifications */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                style={styles.iconBtn(notifOpen)}
                onMouseEnter={e => { if (!notifOpen) e.currentTarget.style.background = "#f5ede0"; }}
                onMouseLeave={e => { if (!notifOpen) e.currentTarget.style.background = "transparent"; }}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span style={styles.notifBadge}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div style={{ ...styles.dropdown, width: 340 }}>
                  <div style={styles.notifHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#2d1f0e", margin: 0, fontFamily: "system-ui" }}>
                        Notifications
                      </p>
                      {unreadCount > 0 && (
                        <span style={{ padding: "2px 8px", background: "#f97316", color: "#fff", borderRadius: 10, fontSize: 9, fontWeight: 800, fontFamily: "system-ui" }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllNotificationsRead())}
                        style={{ fontSize: 10, color: "#f97316", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "system-ui" }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {loading ? (
                      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                        <div style={{ width: 20, height: 20, border: "2px solid #e8ddd0", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div style={{ padding: 40, textAlign: "center" }}>
                        <div style={{ width: 48, height: 48, background: "#f5ede0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                          <Bell size={20} color="#c4a882" />
                        </div>
                        <p style={{ fontSize: 11, color: "#a89070", fontFamily: "system-ui", margin: 0 }}>All caught up</p>
                        <p style={{ fontSize: 10, color: "#c4a882", fontFamily: "system-ui", margin: "4px 0 0" }}>No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const s = typeStyles[notif.type] || { dot: "#9ca3af", bg: "#f9fafb", text: "#374151" };
                        return (
                          <div
                            key={notif._id}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 12,
                              padding: "12px 16px",
                              background: !notif.read ? "#fff7ed" : "transparent",
                              borderBottom: "1px solid #f0e8d8",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => { if (notif.read) e.currentTarget.style.background = "#faf0e6"; }}
                            onMouseLeave={e => { if (notif.read) e.currentTarget.style.background = "transparent"; }}
                          >
                            <div style={{ marginTop: 2, width: 24, height: 24, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, display: "block" }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 12, color: "#2d1f0e", margin: 0, lineHeight: 1.5, fontFamily: "system-ui" }}>{notif.message}</p>
                              <p style={{ fontSize: 10, color: "#a89070", margin: "4px 0 0", fontFamily: "system-ui" }}>
                                {new Date(notif.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                            {!notif.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", flexShrink: 0, marginTop: 4 }} />}
                            <button
                              onClick={() => dispatch(deleteNotification(notif._id))}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#d4c4b0", padding: 2, borderRadius: 4, display: "flex", flexShrink: 0, transition: "color 0.15s" }}
                              onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                              onMouseLeave={e => e.currentTarget.style.color = "#d4c4b0"}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div style={{ padding: "10px 16px", borderTop: "1px solid #e8ddd0", background: "#f5ede0" }}>
                    <button
                      onClick={() => dispatch(fetchNotifications())}
                      style={{ width: "100%", fontSize: 10, color: "#a89070", background: "none", border: "none", cursor: "pointer", fontFamily: "system-ui", fontWeight: 600 }}
                      onMouseEnter={e => e.currentTarget.style.color = "#2d1f0e"}
                      onMouseLeave={e => e.currentTarget.style.color = "#a89070"}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => dispatch(toggleSettingPopup())}
              style={{ ...styles.iconBtn(false), display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5ede0"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Settings size={16} style={{ transition: "transform 0.5s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "rotate(60deg)"}
                onMouseLeave={e => e.currentTarget.style.transform = "rotate(0deg)"}
              />
            </button>

            <div style={styles.divider} />

            {/* Profile */}
            <div style={{ position: "relative" }} ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "none",
                  background: profileOpen ? "#f5ede0" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { if (!profileOpen) e.currentTarget.style.background = "#f5ede0"; }}
                onMouseLeave={e => { if (!profileOpen) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, overflow: "hidden", flexShrink: 0, border: "2px solid #e8ddd0", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "system-ui" }}>{initials}</span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#2d1f0e", margin: 0, fontFamily: "'Georgia', serif", lineHeight: 1 }}>{user?.name || "Guest"}</p>
                  <p style={{ fontSize: 9, color: "#a89070", margin: 0, marginTop: 2, fontFamily: "system-ui" }}>{user?.email?.split("@")[0] || "—"}</p>
                </div>
                <ChevronDown size={13} color="#a89070" style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
              </button>

              {profileOpen && (
                <div style={{ ...styles.dropdown, width: 240 }}>
                  {/* Profile header */}
                  <div style={styles.profileHeader}>
                    <div style={{
                      position: "absolute", top: -20, right: -20, width: 80, height: 80,
                      background: "rgba(249,115,22,0.12)", borderRadius: "50%",
                    }} />
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                        {user?.avatar?.url ? (
                          <img src={user.avatar.url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #f97316, #c2410c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>{initials}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0, fontFamily: "'Georgia', serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user?.name}
                        </p>
                        <p style={{ color: "#6b5a48", fontSize: 10, margin: "3px 0 0", fontFamily: "system-ui", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: 6 }}>
                    {[
                      { icon: User, label: "View profile", action: () => { setProfilePopupOpen(true); setProfileOpen(false); } },
                      { icon: Settings, label: "Settings", action: () => { dispatch(toggleSettingPopup()); setProfileOpen(false); } },
                    ].map(({ icon: Icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", transition: "background 0.15s", fontFamily: "system-ui" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5ede0"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{ width: 26, height: 26, borderRadius: 8, background: "#f0e8d8", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
                          <Icon size={12} color="#a89070" />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#4a3728" }}>{label}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: 6, borderTop: "1px solid #e8ddd0" }}>
                    <button
                      onClick={handleLogout}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", transition: "background 0.15s", fontFamily: "system-ui" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <LogOut size={12} color="#ef4444" />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444" }}>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {profilePopupOpen && <ProfilePopup onClose={() => setProfilePopupOpen(false)} />}
    </>
  );
};

export default Header;