import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [busy,     setBusy]     = useState(false);
  const navigate = useNavigate();
  const { user }  = useAuth();

  // Already logged in? Skip login screen
  useEffect(() => { if (user) navigate("/admin", { replace: true }); }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <img src="/img/logo.png" alt="MyPrEP" style={styles.logo} />
        <h1 style={styles.h1}>Admin Login</h1>
        <p style={styles.sub}>Sign in to manage the Resources page</p>

        {error && <div style={styles.err}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            autoComplete="username"
            style={styles.input}
          />
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            style={styles.input}
          />
          <button type="submit" disabled={busy} style={styles.btn}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  screen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1117" },
  card:   { background: "#181c27", border: "1px solid #252b3b", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 420, textAlign: "center" },
  logo:   { height: 52, marginBottom: 28 },
  h1:     { fontSize: "1.5rem", fontWeight: 700, color: "#e8eaf0", marginBottom: 6 },
  sub:    { color: "#8892a4", fontSize: "0.9rem", marginBottom: 32 },
  err:    { background: "rgba(224,82,82,.12)", border: "1px solid rgba(224,82,82,.3)", color: "#e05252", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: "0.85rem" },
  form:   { display: "flex", flexDirection: "column", gap: 8, textAlign: "left" },
  label:  { fontSize: "0.8rem", fontWeight: 600, color: "#8892a4", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 2 },
  input:  { background: "#0f1117", border: "1px solid #252b3b", borderRadius: 8, padding: "10px 14px", color: "#e8eaf0", fontFamily: "inherit", fontSize: "0.95rem", outline: "none", marginBottom: 8 },
  btn:    { marginTop: 8, background: "#3D80E8", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" },
};
