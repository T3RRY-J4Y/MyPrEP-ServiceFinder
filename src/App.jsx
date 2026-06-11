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
import AdminFacilities from "./pages/admin/AdminFacilities";
import ServiceFinder   from "./pages/ServiceFinder";
import Quiz            from "./pages/Quiz";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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
        <Route path="/service-finder" element={<ServiceFinder />} />
        <Route path="/quiz"           element={<Quiz />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/facilities"
          element={
            <PrivateRoute>
              <AdminFacilities />
            </PrivateRoute>
          }
        />
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
