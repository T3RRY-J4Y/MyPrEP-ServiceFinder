import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { CATEGORIES, PARENT_OF, LABEL_OF } from "../../data/serviceTaxonomy";
import { parseFacilityCsv } from "../../lib/facilityCsv";

const BATCH = 500; // rows per Supabase insert

export default function AdminFacilities() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [file,      setFile]      = useState(null);
  const [label,     setLabel]     = useState("");
  const [services,  setServices]  = useState([]);
  const [replaceAll, setReplaceAll] = useState(false);
  const [busy,      setBusy]      = useState(false);
  const [progress,  setProgress]  = useState("");
  const [toast,     setToast]     = useState(null);
  const [datasets,  setDatasets]  = useState([]);
  const [total,     setTotal]     = useState(0);
  const [dragOver,  setDragOver]  = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("facility_datasets").select("*")
      .order("created_at", { ascending: false });
    setDatasets(data || []);
    const { count } = await supabase
      .from("facilities").select("*", { count: "exact", head: true });
    setTotal(count || 0);
  }

  function showToast(msg, err = false) {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 4000);
  }

  function toggleService(id) {
    setServices(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  function pickFile(f) {
    if (!f) return;
    setFile(f);
    if (!label) setLabel(f.name.replace(/\.csv$/i, "").replace(/[_-]+/g, " "));
  }

  async function handleLogout() { await logout(); navigate("/admin/login"); }

  // ── Upload flow ────────────────────────────────────────────
  async function handleUpload() {
    if (!file)            return showToast("Attach a CSV first.", true);
    if (!services.length) return showToast("Select at least one service so people can find this data.", true);
    if (replaceAll && !window.confirm("Replace ALL existing facilities with this file? This cannot be undone.")) return;

    setBusy(true);
    try {
      setProgress("Reading CSV…");
      const { rows, errors } = await parseFacilityCsv(file);
      if (!rows.length) throw new Error("No valid rows found. " + (errors[0] || ""));

      // auto-include parent categories for chosen subcategories
      const withParents = new Set(services);
      services.forEach(s => { if (PARENT_OF[s]) withParents.add(PARENT_OF[s]); });
      const svcArr = [...withParents];

      if (replaceAll) {
        setProgress("Removing existing data…");
        // deleting datasets cascades to facilities
        const { error } = await supabase.from("facility_datasets")
          .delete().not("id", "is", null);
        if (error) throw error;
      }

      setProgress("Creating dataset…");
      const { data: ds, error: dsErr } = await supabase
        .from("facility_datasets")
        .insert([{
          label: label.trim() || file.name,
          filename: file.name,
          services: svcArr,
          row_count: rows.length,
          skipped: errors.length,
        }])
        .select().single();
      if (dsErr) throw dsErr;

      for (let i = 0; i < rows.length; i += BATCH) {
        setProgress(`Uploading ${Math.min(i + BATCH, rows.length).toLocaleString()} / ${rows.length.toLocaleString()}…`);
        const chunk = rows.slice(i, i + BATCH).map(r => ({
          dataset_id: ds.id,
          name: r.name, address: r.address, area: r.area,
          phone: r.phone, email: r.email, type: r.type,
          lat: r.lat, lng: r.lng,
          services: [...new Set([...svcArr, ...r.rowSvcs])],
        }));
        const { error } = await supabase.from("facilities").insert(chunk);
        if (error) {
          // roll back the half-finished dataset so we don't leave partial data
          await supabase.from("facility_datasets").delete().eq("id", ds.id);
          throw error;
        }
      }

      showToast(`Imported ${rows.length.toLocaleString()} facilities` +
        (errors.length ? ` (${errors.length} rows skipped)` : "") + ".");
      setFile(null); setLabel(""); setServices([]); setReplaceAll(false);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e) {
      showToast("Error: " + e.message, true);
    } finally {
      setBusy(false); setProgress("");
    }
  }

  async function handleDelete(ds) {
    if (!window.confirm(`Delete "${ds.label}" and remove its ${ds.row_count.toLocaleString()} facilities from the map?`)) return;
    const { error } = await supabase.from("facility_datasets").delete().eq("id", ds.id);
    if (error) return showToast("Error: " + error.message, true);
    showToast("Dataset deleted.");
    await load();
  }

  return (
    <div style={s.bg}>
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <img src="/img/logo.png" alt="MyPrEP" style={{ height: 38 }} />
          <span style={s.badge}>Service Finder — Admin</span>
        </div>
        <div style={s.topRight}>
          <Link to="/admin" style={s.ghostLink}>Resources CMS</Link>
          <Link to="/service-finder" style={s.ghostLink}>View Finder</Link>
          <span style={s.userPill}>{user?.email}</span>
          <button onClick={handleLogout} style={s.ghostBtn}>Sign out</button>
        </div>
      </div>

      <div style={s.main}>
        {/* ── Upload card ── */}
        <div style={s.card}>
          <h2 style={s.h2}>Upload facility data</h2>
          <p style={s.sub}>Drop in a CSV, tick which services it covers, and it goes live on the map immediately.
            Semicolon or comma delimited both work; coordinates with decimal commas ("-30,17988") are handled.</p>

          <div
            style={{ ...s.drop, ...(dragOver ? s.dropOver : {}) }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]); }}
          >
            <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
                   onChange={e => pickFile(e.target.files[0])} />
            {file
              ? <span style={{ color: "#fbbf24", fontWeight: 600 }}>{file.name} · {(file.size / 1024).toFixed(0)} KB</span>
              : <span>Drag a CSV here, or{" "}
                  <button style={s.browse} onClick={() => fileRef.current?.click()}>browse</button></span>}
          </div>

          <label style={s.label}>Dataset name</label>
          <input style={s.input} value={label} onChange={e => setLabel(e.target.value)}
                 placeholder="e.g. Oral PrEP sites — June 2026" />

          <label style={s.label}>Which services is this data for? <span style={s.muted}>(select all that apply)</span></label>
          {CATEGORIES.map(c => (
            <div key={c.id} style={{ marginTop: 10 }}>
              <div style={s.groupName}>{c.label}</div>
              <div style={s.chipRow}>
                <Chip on={services.includes(c.id)} parent onClick={() => toggleService(c.id)}>
                  {c.label} (general)
                </Chip>
                {c.subs.map(sub => (
                  <Chip key={sub.id} on={services.includes(sub.id)} onClick={() => toggleService(sub.id)}>
                    {sub.label}
                  </Chip>
                ))}
              </div>
            </div>
          ))}

          <label style={{ ...s.label, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={replaceAll} onChange={e => setReplaceAll(e.target.checked)} />
            Replace ALL existing facility data with this file
          </label>

          <div style={{ marginTop: 20, display: "flex", gap: 14, alignItems: "center" }}>
            <button style={{ ...s.primaryBtn, opacity: busy ? .6 : 1 }} disabled={busy} onClick={handleUpload}>
              {busy ? "Working…" : "Upload & publish"}
            </button>
            {progress && <span style={s.muted}>{progress}</span>}
          </div>
        </div>

        {/* ── Datasets card ── */}
        <div style={s.card}>
          <h2 style={s.h2}>Uploaded datasets</h2>
          <p style={s.sub}>{datasets.length} dataset{datasets.length === 1 ? "" : "s"} · {total.toLocaleString()} facilities live on the map</p>
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Dataset</th><th style={s.th}>Services</th>
                  <th style={s.th}>Rows</th><th style={s.th}>Uploaded</th><th style={s.th}></th>
                </tr>
              </thead>
              <tbody>
                {datasets.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#8892a4" }}>
                    Nothing uploaded yet — your first CSV will appear here.</td></tr>
                )}
                {datasets.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: "1px solid #252b3b", background: i % 2 === 0 ? "#181c27" : "#1a1f2e" }}>
                    <td style={{ ...s.td, color: "#e8eaf0", fontWeight: 500 }}>
                      {d.label}<br /><span style={s.muted}>{d.filename}</span>
                    </td>
                    <td style={s.td}>{(d.services || []).map(t =>
                      <span key={t} style={s.tagPill}>{LABEL_OF[t] || t}</span>)}</td>
                    <td style={s.td}>{d.row_count.toLocaleString()}
                      {d.skipped ? <><br /><span style={s.muted}>{d.skipped} skipped</span></> : null}</td>
                    <td style={{ ...s.td, whiteSpace: "nowrap" }}>{new Date(d.created_at).toLocaleString()}</td>
                    <td style={s.td}>
                      <button style={s.deleteBtn} onClick={() => handleDelete(d)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ ...s.toast, background: toast.err ? "#e05252" : "#3ecf8e", color: toast.err ? "#fff" : "#0f1117" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Chip({ on, parent, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      border: `1px solid ${on ? (parent ? "#3d80e8" : "#f2a33c") : "#3a4255"}`,
      background: on ? (parent ? "rgba(61,128,232,.25)" : "rgba(242,163,60,.22)") : "transparent",
      color: on ? (parent ? "#93c5fd" : "#fbbf24") : "#c0c8d8",
      borderRadius: 999, padding: "7px 14px", fontSize: ".82rem",
      fontWeight: 600, cursor: "pointer",
    }}>{children}</button>
  );
}

const s = {
  bg:        { minHeight: "100vh", background: "#0f1117", color: "#e8eaf0", fontFamily: "inherit" },
  topbar:    { background: "#181c27", borderBottom: "1px solid #252b3b", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 10 },
  topLeft:   { display: "flex", alignItems: "center", gap: 14 },
  topRight:  { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  badge:     { background: "rgba(61,128,232,.2)", color: "#93c5fd", fontSize: "0.72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 6, border: "1px solid rgba(61,128,232,.4)" },
  ghostLink: { background: "transparent", border: "1px solid #3a4255", color: "#c0c8d8", borderRadius: 8, padding: "7px 14px", fontSize: "0.85rem", textDecoration: "none" },
  ghostBtn:  { background: "transparent", border: "1px solid #3a4255", color: "#c0c8d8", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: "0.85rem" },
  userPill:  { color: "#8892a4", fontSize: "0.82rem" },
  main:      { maxWidth: 980, margin: "26px auto", padding: "0 18px", display: "flex", flexDirection: "column", gap: 22 },
  card:      { background: "#181c27", border: "1px solid #252b3b", borderRadius: 14, padding: 26 },
  h2:        { margin: 0, fontSize: "1.2rem", color: "#e8eaf0" },
  sub:       { color: "#8892a4", fontSize: ".85rem", margin: "6px 0 18px" },
  drop:      { border: "2px dashed #3a4255", borderRadius: 12, padding: 26, textAlign: "center", color: "#c0c8d8", background: "#141823", transition: "all .15s" },
  dropOver:  { borderColor: "#3d80e8", background: "#1a2233" },
  browse:    { background: "none", border: 0, color: "#60a5fa", fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontSize: "inherit" },
  label:     { display: "block", fontWeight: 600, fontSize: ".84rem", margin: "16px 0 6px", color: "#c0c8d8" },
  input:     { width: "100%", background: "#141823", border: "1px solid #3a4255", borderRadius: 8, padding: "10px 13px", color: "#e8eaf0", fontSize: ".9rem" },
  groupName: { fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#8892a4", fontWeight: 700, marginBottom: 6 },
  chipRow:   { display: "flex", flexWrap: "wrap", gap: 8 },
  primaryBtn:{ background: "#3d80e8", color: "#fff", border: 0, borderRadius: 999, padding: "12px 26px", fontWeight: 700, fontSize: ".92rem", cursor: "pointer" },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: ".84rem" },
  th:        { textAlign: "left", fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#8892a4", padding: "8px 10px", borderBottom: "2px solid #252b3b" },
  td:        { padding: "11px 10px", verticalAlign: "top", color: "#c0c8d8" },
  tagPill:   { display: "inline-block", background: "rgba(61,128,232,.18)", color: "#93c5fd", fontSize: ".68rem", fontWeight: 600, borderRadius: 999, padding: "2px 9px", margin: "1px 3px 1px 0" },
  deleteBtn: { background: "transparent", border: "1px solid #5c3a3a", color: "#f0a3a3", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: ".78rem" },
  muted:     { color: "#8892a4", fontSize: ".76rem" },
  toast:     { position: "fixed", bottom: 24, right: 24, padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 1000, maxWidth: 420 },
};
