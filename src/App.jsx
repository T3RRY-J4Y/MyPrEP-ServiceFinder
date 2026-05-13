import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Home       from "./pages/Home";
import Methods    from "./pages/Methods";
import PvPvA      from "./pages/PvPvA";
import Resources  from "./pages/Resources";
import Training   from "./pages/Training";
import Faqs       from "./pages/Faqs";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDash  from "./pages/admin/AdminDash";

// ── Route guard: only authenticated users reach admin ─────────
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading…</div>;
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/methods"   element={<Methods />} />
        <Route path="/pvpva"     element={<PvPvA />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/training"  element={<Training />} />
        <Route path="/faqs"      element={<Faqs />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDash />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
