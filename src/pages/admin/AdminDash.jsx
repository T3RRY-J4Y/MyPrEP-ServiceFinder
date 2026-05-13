import { useState, useEffect } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const TABS     = ["policy", "job-aids", "iec", "community"];
const TAB_LABELS = {
  policy: "Implementation Guidelines",
  "job-aids": "Job Aids",
  iec: "IEC Materials",
  community: "Community Engagement"
};
const ALL_TAGS = ["oral","len","pep","dvr","cabla","prepchoice","srhr"];
const EMPTY    = { title: "", url: "", tab: "policy", tags: [] };

export default function AdminDash() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();

  const [resources, setResources] = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [editing,   setEditing]   = useState(null);
  const [toast,     setToast]     = useState(null);
  const [search,    setSearch]    = useState("");
  const [busy,      setBusy]      = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const q    = query(collection(db, "resources"), orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  function showToast(msg, err = false) {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3000);
  }

  function toggleTag(tag) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.url.trim()) {
      showToast("Title and URL are required.", true); return;
    }
    setBusy(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "resources", editing), {
          title: form.title, url: form.url, tab: form.tab, tags: form.tags
        });
        showToast("Resource updated!");
      } else {
        await addDoc(collection(db, "resources"), { ...form, createdAt: serverTimestamp() });
        showToast("Resource added!");
      }
      setForm(EMPTY);
      setEditing(null);
      await load();
    } catch (e) {
      showToast("Error: " + e.message, true);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(r) {
    setEditing(r.id);
    setForm({ title: r.title, url: r.url, tab: r.tab, tags: r.tags || [] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(r) {
    if (!confirm(`Delete "${r.title}"?\nThis cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "resources", r.id));
      showToast("Deleted.");
      await load();
    } catch (e) {
      showToast("Error: " + e.message, true);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.tab || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:      resources.length,
    policy:     resources.filter(r => r.tab === "policy").length,
    "job-aids": resources.filter(r => r.tab === "job-aids").length,
    iec:        resources.filter(r => r.tab === "iec").length,
    community:  resources.filter(r => r.tab === "community").length,
  };

  return (
    <div style={s.bg}>

      {/* ── Topbar ── */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <img src="/img/logo.png" alt="MyPrEP" style={{ height: 38 }} />
          <span style={s.badge}>Admin CMS</span>
        </div>
        <div style={s.topRight}>
          <Link to="/resources" style={s.ghostLink}>View Site ↗</Link>
          <span style={s.userPill}>{user?.email}</span>
          <button onClick={handleLogout} style={s.ghostBtn}>Sign out</button>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.pageHeader}>
          <h2 style={s.h2}>Resources Manager</h2>
          <p style={s.muted}>Add, edit, and delete resources displayed on the public Resources page.</p>
        </div>

        {/* ── Stats ── */}
        <div style={s.statsGrid}>
          {[
            ["Total",      stats.total],
            ["Guidelines", stats.policy],
            ["Job Aids",   stats["job-aids"]],
            ["IEC",        stats.iec],
            ["Community",  stats.community],
          ].map(([k, v]) => (
            <div key={k} style={s.statCard}>
              <div style={s.statLabel}>{k}</div>
              <div style={s.statVal}>{v}</div>
            </div>
          ))}
        </div>

        {/* ── Add / Edit form ── */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>{editing ? "✏️ Edit Resource" : "＋ Add New Resource"}</h3>
          <div style={s.formGrid}>

            <div style={{ gridColumn: "1/-1" }}>
              <label style={s.label}>Resource Title</label>
              <input
                style={s.input}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Oral PrEP Implementation Guideline (2022)"
              />
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label style={s.label}>PDF / File URL</label>
              <input
                style={s.input}
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                placeholder="e.g. /pdfs/MyDoc.pdf or https://..."
              />
            </div>

            <div>
              <label style={s.label}>Tab (Category)</label>
              <select
                style={s.input}
                value={form.tab}
                onChange={e => setForm(f => ({ ...f, tab: e.target.value }))}
              >
                {TABS.map(t => (
                  <option key={t} value={t} style={{ background: "#1e2435", color: "#e8eaf0" }}>
                    {TAB_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={s.label}>Tags (select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {ALL_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    style={{
                      ...s.tagChip,
                      ...(form.tags.includes(tag) ? s.tagActive : {})
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={handleSave} disabled={busy} style={s.btnSuccess}>
              {busy ? "Saving…" : editing ? "Save Changes" : "Save Resource"}
            </button>
            {editing && (
              <button onClick={() => { setEditing(null); setForm(EMPTY); }} style={s.ghostBtn}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <h3 style={s.cardTitle}>All Resources ({resources.length})</h3>
            <input
              style={{ ...s.input, maxWidth: 280, marginBottom: 0 }}
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1e2435" }}>
                  {["Title", "Tab", "Tags", "URL", "Actions"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#8892a4" }}>
                      No resources yet. Add one above.
                    </td>
                  </tr>
                )}
                {filtered.map((r, i) => (
                  <tr
  key={r.id}
  style={{
    borderBottom: "1px solid #252b3b",
    background: i % 2 === 0 ? "#181c27" : "#1a1f2e",
  }}
>
  <td
    style={{
      ...s.td,
      maxWidth: 260,
      wordBreak: "break-word",
      color: "#e8eaf0",
      fontWeight: 500,
    }}
  >
    {r.title}
  </td>

  <td style={s.td}>
    <span style={s.tabBadge}>
      {TAB_LABELS[r.tab] || r.tab}
    </span>
  </td>

  <td style={s.td}>
    {(r.tags || []).map((t) => (
      <span key={t} style={s.tagPill}>
        {t}
      </span>
    ))}
  </td>

  <td
    style={{
      ...s.td,
      maxWidth: 200,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }}
  >
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#60a5fa",
        fontSize: "0.82rem",
      }}
    >
      {r.url}
    </a>
  </td>

  <td style={s.td}>
    <div style={{ display: "flex", gap: 6 }}>
      <button
        onClick={() => startEdit(r)}
        style={s.editBtn}
        title="Edit"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(r)}
        style={s.deleteBtn}
        title="Delete"
      >
        Delete
      </button>
    </div>
  </td>
</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          ...s.toast,
          background: toast.err ? "#e05252" : "#3ecf8e",
          color: toast.err ? "#fff" : "#0f1117"
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

const s = {
  bg:         { minHeight: "100vh", background: "#0f1117", color: "#e8eaf0", fontFamily: "inherit" },
  topbar:     { background: "#181c27", borderBottom: "1px solid #252b3b", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 10 },
  topLeft:    { display: "flex", alignItems: "center", gap: 14 },
  topRight:   { display: "flex", alignItems: "center", gap: 12 },
  badge:      { background: "rgba(61,128,232,.2)", color: "#93c5fd", fontSize: "0.72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(61,128,232,.4)" },
  ghostLink:  { background: "transparent", border: "1px solid #3a4255", color: "#c0c8d8", borderRadius: 8, padding: "7px 14px", fontSize: "0.85rem", textDecoration: "none" },
  ghostBtn:   { background: "transparent", border: "1px solid #3a4255", color: "#c0c8d8", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: "0.85rem" },
  userPill:   { fontSize: "0.82rem", color: "#c0c8d8", background: "#0f1117", border: "1px solid #3a4255", borderRadius: 99, padding: "5px 14px" },
  main:       { maxWidth: 1200, margin: "0 auto", padding: "32px 28px" },
  pageHeader: { marginBottom: 28 },
  h2:         { fontSize: "1.6rem", fontWeight: 700, marginBottom: 4, color: "#f0f2f8" },
  muted:      { color: "#8892a4", fontSize: "0.9rem" },
  statsGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, marginBottom: 28 },
  statCard:   { background: "#181c27", border: "1px solid #2a3147", borderRadius: 12, padding: 20 },
  statLabel:  { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "#8892a4", marginBottom: 8 },
  statVal:    { fontSize: "2rem", fontWeight: 700, fontFamily: "monospace", color: "#f0f2f8" },
  card:       { background: "#181c27", border: "1px solid #2a3147", borderRadius: 12, padding: 24, marginBottom: 24 },
  cardTitle:  { fontSize: "1rem", fontWeight: 700, marginBottom: 18, color: "#f0f2f8" },
  formGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label:      { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#93a3bc", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 },
  input:      { width: "100%", background: "#0d1117", border: "1px solid #2a3147", borderRadius: 8, padding: "10px 14px", color: "#f0f2f8", fontFamily: "inherit", fontSize: "0.95rem", outline: "none", marginBottom: 8, boxSizing: "border-box" },
  btnSuccess: { background: "#3ecf8e", color: "#0f1117", border: "none", borderRadius: 8, padding: "11px 22px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" },
  tagChip:    { padding: "6px 14px", borderRadius: 99, border: "1px solid #2a3147", fontSize: "0.82rem", fontWeight: 600, color: "#93a3bc", cursor: "pointer", background: "#0d1117" },
  tagActive:  { background: "rgba(61,128,232,.2)", borderColor: "#3D80E8", color: "#93c5fd" },
  th:         { textAlign: "left", fontSize: "0.72rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#93a3bc", padding: "12px 16px", borderBottom: "1px solid #2a3147" },
  td:         { padding: "14px 16px", fontSize: "0.9rem", verticalAlign: "middle", color: "#c0c8d8" },
  tabBadge:   { display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, background: "rgba(235,166,20,.15)", color: "#fbbf24", border: "1px solid rgba(235,166,20,.3)", whiteSpace: "nowrap" },
  tagPill:    { display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, background: "rgba(61,128,232,.15)", color: "#93c5fd", border: "1px solid rgba(61,128,232,.3)", margin: 2 },
  editBtn:    { padding: "6px 12px", borderRadius: 8, border: "1px solid #2a3147", background: "rgba(61,128,232,.1)", color: "#93c5fd", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 },
  deleteBtn:  { padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(224,82,82,.3)", background: "rgba(224,82,82,.1)", color: "#f87171", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 },
  toast:      { position: "fixed", bottom: 28, right: 28, padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", zIndex: 9999 },
};