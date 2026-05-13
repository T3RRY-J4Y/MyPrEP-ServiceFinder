import { useState, useEffect } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const TABS    = ["policy", "job-aids", "iec", "community"];
const TAB_LABELS = { policy: "Implementation Guidelines", "job-aids": "Job Aids", iec: "IEC Materials", community: "Community Engagement" };
const ALL_TAGS   = ["oral","len","pep","dvr","cabla","prepchoice","srhr"];

const EMPTY = { title: "", url: "", tab: "policy", tags: [] };

export default function AdminDash() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();

  const [resources, setResources] = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [editing,   setEditing]   = useState(null); // resource id being edited
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
        await updateDoc(doc(db, "resources", editing), { title: form.title, url: form.url, tab: form.tab, tags: form.tags });
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
    total:    resources.length,
    policy:   resources.filter(r => r.tab === "policy").length,
    "job-aids": resources.filter(r => r.tab === "job-aids").length,
    iec:      resources.filter(r => r.tab === "iec").length,
    community:resources.filter(r => r.tab === "community").length,
  };

  return (
    <div style={s.bg}>
      {/* Topbar */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <img src="/img/logo.png" alt="MyPrEP" style={{ height: 38 }} />
          <span style={s.badge}>Admin CMS</span>
        </div>
        <div style={s.topRight}>
          <Link to="/resources" style={s.ghost}>View Site ↗</Link>
          <span style={s.userPill}>{user?.email}</span>
          <button onClick={handleLogout} style={s.ghost}>Sign out</button>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.pageHeader}>
          <h2 style={s.h2}>Resources Manager</h2>
          <p style={s.muted}>Add, edit, and delete resources displayed on the public Resources page.</p>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[["Total", stats.total],["Guidelines", stats.policy],["Job Aids", stats["job-aids"]],["IEC", stats.iec],["Community", stats.community]].map(([k,v]) => (
            <div key={k} style={s.statCard}>
              <div style={s.statLabel}>{k}</div>
              <div style={s.statVal}>{v}</div>
            </div>
          ))}
        </div>

        {/* Add / Edit form */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>{editing ? "✏️ Edit Resource" : "＋ Add New Resource"}</h3>
          <div style={s.formGrid}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={s.label}>Resource Title</label>
              <input style={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Oral PrEP Implementation Guideline (2022)" />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={s.label}>PDF / File URL</label>
              <input style={s.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="e.g. /pdfs/MyDoc.pdf or https://..." />
            </div>
            <div>
              <label style={s.label}>Tab</label>
              <select style={s.input} value={form.tab} onChange={e => setForm(f => ({ ...f, tab: e.target.value }))}>
                {TABS.map(t => <option key={t} value={t}>{TAB_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Tags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {ALL_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{ ...s.tagChip, ...(form.tags.includes(tag) ? s.tagActive : {}) }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button onClick={handleSave} disabled={busy} style={s.btnSuccess}>
              {busy ? "Saving…" : editing ? "Save Changes" : "Save Resource"}
            </button>
            {editing && (
              <button onClick={() => { setEditing(null); setForm(EMPTY); }} style={s.btnGhost}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <h3 style={s.cardTitle}>All Resources ({resources.length})</h3>
            <input style={{ ...s.input, maxWidth: 280, marginBottom: 0 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Title", "Tab", "Tags", "URL", "Actions"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#8892a4" }}>No resources yet.</td></tr>
                )}
                {filtered.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #252b3b" }}>
                    <td style={s.td}>{r.title}</td>
                    <td style={s.td}><span style={s.tabBadge}>{TAB_LABELS[r.tab] || r.tab}</span></td>
                    <td style={s.td}>{(r.tags || []).map(t => <span key={t} style={s.tagPill}>{t}</span>)}</td>
                    <td style={{ ...s.td, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3D80E8", fontSize: "0.82rem" }}>{r.url}</a>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => startEdit(r)} style={s.iconBtn} title="Edit">✏️</button>
                        <button onClick={() => handleDelete(r)} style={{ ...s.iconBtn, color: "#e05252" }} title="Delete">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ ...s.toast, background: toast.err ? "#e05252" : "#3ecf8e", color: toast.err ? "#fff" : "#0f1117" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

const s = {
  bg:        { minHeight: "100vh", background: "#0f1117", color: "#e8eaf0", fontFamily: "inherit" },
  topbar:    { background: "#181c27", borderBottom: "1px solid #252b3b", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 10 },
  topLeft:   { display: "flex", alignItems: "center", gap: 14 },
  topRight:  { display: "flex", alignItems: "center", gap: 12 },
  badge:     { background: "rgba(61,128,232,.15)", color: "#3D80E8", fontSize: "0.72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(61,128,232,.3)" },
  ghost:     { background: "transparent", border: "1px solid #252b3b", color: "#8892a4", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: "0.85rem", textDecoration: "none" },
  userPill:  { fontSize: "0.82rem", color: "#8892a4", background: "#0f1117", border: "1px solid #252b3b", borderRadius: 99, padding: "5px 14px" },
  main:      { maxWidth: 1200, margin: "0 auto", padding: "32px 28px" },
  pageHeader:{ marginBottom: 28 },
  h2:        { fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 },
  muted:     { color: "#8892a4", fontSize: "0.9rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, marginBottom: 28 },
  statCard:  { background: "#181c27", border: "1px solid #252b3b", borderRadius: 12, padding: 20 },
  statLabel: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "#8892a4", marginBottom: 8 },
  statVal:   { fontSize: "2rem", fontWeight: 700, fontFamily: "monospace" },
  card:      { background: "#181c27", border: "1px solid #252b3b", borderRadius: 12, padding: 24, marginBottom: 24 },
  cardTitle: { fontSize: "1rem", fontWeight: 700, marginBottom: 18 },
  formGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label:     { display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#8892a4", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 },
  input:     { width: "100%", background: "#0f1117", border: "1px solid #252b3b", borderRadius: 8, padding: "10px 14px", color: "#e8eaf0", fontFamily: "inherit", fontSize: "0.95rem", outline: "none", marginBottom: 8, boxSizing: "border-box" },
  btnSuccess:{ background: "#3ecf8e", color: "#0f1117", border: "none", borderRadius: 8, padding: "11px 22px", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" },
  btnGhost:  { background: "transparent", border: "1px solid #252b3b", color: "#8892a4", borderRadius: 8, padding: "11px 22px", cursor: "pointer", fontSize: "0.95rem" },
  tagChip:   { padding: "5px 12px", borderRadius: 99, border: "1px solid #252b3b", fontSize: "0.8rem", fontWeight: 600, color: "#8892a4", cursor: "pointer", background: "transparent" },
  tagActive: { background: "rgba(61,128,232,.15)", borderColor: "#3D80E8", color: "#3D80E8" },
  th:        { textAlign: "left", fontSize: "0.72rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#8892a4", padding: "12px 16px", borderBottom: "1px solid #252b3b" },
  td:        { padding: "14px 16px", fontSize: "0.9rem", verticalAlign: "middle" },
  tabBadge:  { display: "inline-block", padding: "3px 9px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600, background: "rgba(235,166,20,.1)", color: "#EBA614", border: "1px solid rgba(235,166,20,.25)", whiteSpace: "nowrap" },
  tagPill:   { display: "inline-block", padding: "2px 9px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, background: "rgba(61,128,232,.12)", color: "#3D80E8", border: "1px solid rgba(61,128,232,.25)", margin: 2 },
  iconBtn:   { width: 34, height: 34, borderRadius: 8, border: "1px solid #252b3b", background: "transparent", cursor: "pointer", fontSize: "1rem" },
  toast:     { position: "fixed", bottom: 28, right: 28, padding: "12px 20px", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", zIndex: 9999 },
};
