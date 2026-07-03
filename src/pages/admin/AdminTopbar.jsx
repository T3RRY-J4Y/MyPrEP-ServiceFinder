import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin",            label: "Resources"  },
  { to: "/admin/facilities", label: "Facilities" },
];

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div style={s.topbar}>
      <div style={s.left}>
        <img src="/img/logo.webp" alt="MyPrEP" style={{ height: 38 }} />
        <span style={s.badge}>Admin</span>
      </div>
      <div style={s.right}>
        {NAV.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            style={{ ...s.navLink, ...(pathname === to ? s.navActive : {}) }}
          >
            {label}
          </Link>
        ))}
        <Link to="/" style={s.navLink}>View Site</Link>
        <span style={s.userPill}>{user?.email}</span>
        <button onClick={handleLogout} style={s.ghostBtn}>Sign out</button>
      </div>
    </div>
  );
}

const s = {
  topbar:    { background: "#181c27", borderBottom: "1px solid #252b3b", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 10 },
  left:      { display: "flex", alignItems: "center", gap: 14 },
  right:     { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  badge:     { background: "rgba(61,128,232,.2)", color: "#93c5fd", fontSize: "0.72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(61,128,232,.4)" },
  navLink:   { background: "transparent", border: "1px solid #3a4255", color: "#c0c8d8", borderRadius: 8, padding: "7px 14px", fontSize: "0.85rem", textDecoration: "none" },
  navActive: { background: "rgba(61,128,232,.2)", borderColor: "#3D80E8", color: "#93c5fd", fontWeight: 600 },
  userPill:  { fontSize: "0.82rem", color: "#c0c8d8", background: "#0f1117", border: "1px solid #3a4255", borderRadius: 99, padding: "5px 14px" },
  ghostBtn:  { background: "transparent", border: "1px solid #3a4255", color: "#c0c8d8", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: "0.85rem" },
};
