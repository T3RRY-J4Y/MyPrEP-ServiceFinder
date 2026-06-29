import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Home is the landing page — keep it eager so it paints immediately.
import Home from "./pages/Home";

// Everything else is code-split so the homepage bundle stays small.
// The Service Finder in particular drags in Leaflet + markercluster + Papa Parse.
const Methods         = lazy(() => import("./pages/Methods"));
const PvPvA           = lazy(() => import("./pages/PvPvA"));
const Resources       = lazy(() => import("./pages/Resources"));
const Training        = lazy(() => import("./pages/Training"));
const Faqs            = lazy(() => import("./pages/Faqs"));
const AdminLogin      = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDash       = lazy(() => import("./pages/admin/AdminDash"));
const AdminFacilities = lazy(() => import("./pages/admin/AdminFacilities"));
const AdminHome       = lazy(() => import("./pages/admin/AdminHome"));
const ServiceFinder   = lazy(() => import("./pages/ServiceFinder"));
const Quiz            = lazy(() => import("./pages/Quiz"));
const PrivacyPolicy   = lazy(() => import("./pages/PrivacyPolicy"));

// ── Route guard: only authenticated users reach admin ─────────
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading…</div>;
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Suspense fallback={<div className="page-loading">Loading…</div>}>
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
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <PrivateRoute>
              <AdminDash />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}