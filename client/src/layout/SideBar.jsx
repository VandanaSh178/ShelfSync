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
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
// Add to imports at the top:
import { toggleSettingPopup } from "../store/slices/popUpSlice";
import { Sparkles } from "lucide-react";

const SideBar = ({
  isSideBarOpen,
  setIsSideBarOpen,
  setSelectedComponent,
  selectedComponent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ✅ Fixed: was state.popup, now state.popups
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
          padding: "9px 12px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s ease",
          background: isActive ? "#f97316" : "transparent",
          position: "relative",
          marginBottom: 2,
        }}
        onMouseEnter={e => {
          if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
        }}
        onMouseLeave={e => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
      >
        {/* Active left bar */}
        {isActive && (
          <span style={{
            position: "absolute",
            left: -12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: 20,
            borderRadius: "0 3px 3px 0",
            background: "#fb923c",
          }} />
        )}

        {/* Icon container */}
        <span style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.15s",
        }}>
          <Icon size={14} color={isActive ? "#fff" : "#6b7280"} />
        </span>

        <span style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: isActive ? "#fff" : "#9ca3af",
          flex: 1,
          textAlign: "left",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {label}
        </span>

        {isActive && <ChevronRight size={12} color="rgba(255,255,255,0.6)" />}
      </button>
    );
  };

  const SectionLabel = ({ label }) => (
    <p style={{
      padding: "16px 12px 6px",
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "#374151",
      fontFamily: "'DM Sans', sans-serif",
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
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 45,
            display: "block",
          }}
          className="md:hidden"
        />
      )}

      <aside style={{
        position: "fixed",
        top: 0, left: 0,
        zIndex: 50,
        height: "100vh",
        width: 230,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
        fontFamily: "'DM Sans', sans-serif",
      }}
      className={`transition-transform duration-500 ease-in-out ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* Close - mobile */}
        <button
          onClick={() => setIsSideBarOpen(false)}
          style={{
            position: "absolute", top: 14, right: 14,
            padding: 6,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          className="md:hidden"
        >
          <X size={14} color="#6b7280" />
        </button>

        {/* Logo area */}
        <div style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Logo mark */}
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(249,115,22,0.4)",
              flexShrink: 0,
            }}>
              <Layers size={16} color="#fff" />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: "-0.02em", lineHeight: 1 }}>
                ShelfSync
              </p>
              <p style={{ color: "#4b5563", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>
                Library OS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto" }}>

          <SectionLabel label="Core" />
          <NavItem name="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem name="books" icon={Book} label="Catalog" />
          <NavItem name="ai" icon={Sparkles} label="AI Picks" />

          {user?.role === "admin" && (
            <>
              <SectionLabel label="Control Plane" />
              <NavItem name="catalog" icon={Library} label="Inventory" />
              <NavItem name="users" icon={Users} label="User Base" />

              {/* New Admin button */}
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() => dispatch(toggleAddNewAdminPopup())}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(249,115,22,0.25)",
                    background: "rgba(249,115,22,0.06)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(249,115,22,0.12)";
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(249,115,22,0.06)";
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.25)";
                  }}
                >
                  <span style={{
                    width: 30, height: 30,
                    borderRadius: 8,
                    background: "rgba(249,115,22,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <RiAdminFill size={14} color="#f97316" />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#f97316", letterSpacing: "0.04em" }}>
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

        {/* Bottom section */}
        <div style={{
          padding: "10px 12px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}>

          {/* Security */}
          <button
            onClick={() => dispatch(toggleSettingPopup())}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShieldCheck size={14} color="#4b5563" />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#4b5563", letterSpacing: "0.04em" }}>Security</span>
          </button>

          {/* User card */}
          <div style={{
            padding: "10px 12px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            {/* Avatar */}
            <div style={{
              width: 34, height: 34,
              borderRadius: 9,
              overflow: "hidden",
              flexShrink: 0,
              border: "1.5px solid rgba(249,115,22,0.3)",
            }}>
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, #f97316, #c2410c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>{initials}</span>
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#e5e7eb", fontSize: 12, fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "Guest"}
              </p>
              <p style={{ color: "#4b5563", fontSize: 10, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.email || "—"}
              </p>
            </div>

            {/* Online dot */}
            <span style={{
              width: 7, height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              flexShrink: 0,
              boxShadow: "0 0 6px rgba(34,197,94,0.6)",
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
              border: "none",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.06)";
              e.currentTarget.querySelector("span").style.color = "#f87171";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.querySelector("span").style.color = "#4b5563";
            }}
          >
            <span style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <LogOut size={14} color="#4b5563" />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#4b5563", letterSpacing: "0.04em", transition: "color 0.15s" }}>
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