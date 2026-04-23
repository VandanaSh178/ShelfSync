import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import {
  LayoutDashboard, Book, Library, Users, LogOut,
  X, BookOpenCheck, ShieldCheck, Layers, ChevronRight
} from "lucide-react";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import { Sparkles } from "lucide-react";

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  setSelectedComponent,
  selectedComponent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);
  const { user, error, message } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleNavClick = (component) => {
    setSelectedComponent(component);
    if (window.innerWidth < 768) setIsSideBarOpen(false);
  };

  useEffect(() => {
    if (error) { toast.error(error); dispatch(resetAuthSlice()); }
    if (message) { toast.success(message); dispatch(resetAuthSlice()); }
  }, [dispatch, error, message]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // ── Color tokens matching landing/login page ──
  const C = {
    bg: "#faf6f0",              // warm cream background
    bgDeep: "#f5ede0",          // slightly deeper cream
    border: "#e8ddd0",          // warm border
    orange: "#f97316",          // primary accent
    orangeDeep: "#ea580c",
    textPrimary: "#2d1f0e",     // dark warm brown
    textMuted: "#a89070",       // muted brown
    textFaint: "#c4a882",       // very faint
    sectionLabel: "#c4a882",
    dark: "#1a1612",            // near-black warm
  };

  const NavItem = ({ name, icon: Icon, label }) => {
    const isActive = selectedComponent === name;
    return (
      <button
        onClick={() => handleNavClick(name)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          borderRadius: 10,
          border: isActive ? `1.5px solid rgba(249,115,22,0.2)` : "1.5px solid transparent",
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: isActive ? "#fff7ed" : "transparent",
          position: "relative",
          marginBottom: 2,
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = C.bgDeep;
            e.currentTarget.style.borderColor = C.border;
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }
        }}
      >
        {/* Active indicator */}
        {isActive && (
          <span style={{
            position: "absolute",
            left: -1,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: 18,
            borderRadius: "0 3px 3px 0",
            background: C.orange,
          }} />
        )}

        {/* Icon */}
        <span style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: isActive ? "#fff7ed" : C.bgDeep,
          border: `1px solid ${isActive ? "rgba(249,115,22,0.2)" : C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.2s",
        }}>
          <Icon size={13} color={isActive ? C.orange : C.textMuted} />
        </span>

        <span style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.03em",
          color: isActive ? C.textPrimary : C.textMuted,
          flex: 1,
          textAlign: "left",
          fontFamily: "system-ui, sans-serif",
          transition: "color 0.2s",
        }}>
          {label}
        </span>

        {isActive && <ChevronRight size={11} color={C.orange} />}
      </button>
    );
  };

  const SectionLabel = ({ label }) => (
    <p style={{
      padding: "14px 12px 5px",
      fontSize: 8,
      fontWeight: 800,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: C.sectionLabel,
      fontFamily: "system-ui, sans-serif",
      margin: 0,
    }}>
      {label}
    </p>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isSideBarOpen && (
        <div
          onClick={() => setIsSideBarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(26,22,18,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 45,
          }}
          className="md:hidden"
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0, left: 0,
          zIndex: 50,
          height: "100vh",
          width: 232,
          display: "flex",
          flexDirection: "column",
          background: C.bg,
          borderRight: `1.5px solid ${C.border}`,
          boxShadow: "4px 0 32px rgba(0,0,0,0.06)",
          fontFamily: "'Georgia', serif",
        }}
        className={`transition-transform duration-500 ease-in-out ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* Orange accent bar top */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${C.orange}, ${C.orangeDeep})`, flexShrink: 0 }} />

        {/* Mobile close */}
        <button
          onClick={() => setIsSideBarOpen(false)}
          style={{
            position: "absolute", top: 14, right: 14,
            padding: 6,
            background: C.bgDeep,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          className="md:hidden"
        >
          <X size={13} color={C.textMuted} />
        </button>

        {/* ── Logo ── */}
        <div style={{
          padding: "18px 16px 16px",
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 38, height: 38,
              background: C.dark,
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              flexShrink: 0,
              position: "relative",
            }}>
              <Layers size={15} color="#fff" />
              {/* Orange dot */}
              <span style={{
                position: "absolute", top: -2, right: -2,
                width: 9, height: 9,
                background: C.orange,
                borderRadius: "50%",
                border: `2px solid ${C.bg}`,
              }} />
            </div>
            <div>
              <p style={{ color: C.textPrimary, fontWeight: 900, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Georgia', serif", margin: 0, lineHeight: 1 }}>
                ShelfSync
              </p>
              <p style={{ color: C.textFaint, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 3, fontFamily: "system-ui", lineHeight: 1, margin: 0, marginTop: 4 }}>
                Library OS
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto" }}>

          <SectionLabel label="Core" />
          <NavItem name="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem name="books" icon={Book} label="Catalog" />
          <NavItem name="ai" icon={Sparkles} label="AI Picks" />

          {user?.role === "admin" && (
            <>
              <SectionLabel label="Control" />
              <NavItem name="catalog" icon={Library} label="Inventory" />
              <NavItem name="users" icon={Users} label="User Base" />

              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => dispatch(toggleAddNewAdminPopup())}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: `1.5px dashed rgba(249,115,22,0.35)`,
                    background: "rgba(249,115,22,0.04)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(249,115,22,0.08)";
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(249,115,22,0.04)";
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)";
                  }}
                >
                  <span style={{
                    width: 28, height: 28,
                    borderRadius: 8,
                    background: "#fff7ed",
                    border: "1px solid rgba(249,115,22,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <RiAdminFill size={13} color={C.orange} />
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.orange, letterSpacing: "0.04em", fontFamily: "system-ui" }}>
                    New Admin
                  </span>
                </button>
              </div>
            </>
          )}

          {user?.role === "user" && (
            <>
              <SectionLabel label="Personal" />
              <NavItem name="my borrowed books" icon={BookOpenCheck} label="My Records" />
            </>
          )}

        </nav>

        {/* ── Bottom ── */}
        <div style={{
          padding: "10px 12px 14px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          flexShrink: 0,
        }}>

          {/* Security */}
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px",
              borderRadius: 10,
              border: "1.5px solid transparent",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.bgDeep; e.currentTarget.style.borderColor = C.border; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: C.bgDeep,
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShieldCheck size={13} color={C.textMuted} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.03em", fontFamily: "system-ui" }}>
              Security
            </span>
          </button>

          {/* User card */}
          <div style={{
            padding: "10px 12px",
            background: C.bgDeep,
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 9,
              overflow: "hidden",
              flexShrink: 0,
              border: `2px solid rgba(249,115,22,0.25)`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}>
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDeep})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "system-ui" }}>{initials}</span>
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: C.textPrimary, fontSize: 12, fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Georgia', serif" }}>
                {user?.name || "Guest"}
              </p>
              <p style={{ color: C.textMuted, fontSize: 9, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "system-ui", marginTop: 2 }}>
                {user?.email || "—"}
              </p>
            </div>

            {/* Online dot */}
            <span style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
              boxShadow: "0 0 6px rgba(34,197,94,0.5)",
            }} />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px",
              borderRadius: 10,
              border: "1.5px solid transparent",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: C.bgDeep,
              border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <LogOut size={13} color="#ef4444" />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", letterSpacing: "0.03em", fontFamily: "system-ui" }}>
              Sign Out
            </span>
          </button>

        </div>
      </aside>

      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;