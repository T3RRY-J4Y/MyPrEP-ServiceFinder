import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES, LABEL_OF } from "../../data/serviceTaxonomy";
import AdminTopbar from "./AdminTopbar";

export default function AdminHome() {
  const { user } = useAuth();

  const [stats,    setStats]    = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let alive = true;
    loadAll().then(({ stats, recent }) => {
      if (!alive) return;
      setStats(stats);
      setRecent(recent);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.email?.split("@")[0] ?? "Admin";

  return (
    <div style={s.bg}>
      <AdminTopbar />

      <div style={s.main}>
        {/* ── Greeting ── */}
        <div style={s.greeting}>
          <div>
            <h1 style={s.h1}>{greeting}, {firstName}</h1>
            <p style={s.muted}>{now.toLocaleDateString("en-ZA", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={s.statsGrid}>
          <StatCard loading={loading} label="Total facilities" value={stats?.totalFacilities?.toLocaleString()} accent="#3D80E8" />
          <StatCard loading={loading} label="Datasets uploaded" value={stats?.datasets?.length}               accent="#3ecf8e" />
          <StatCard loading={loading} label="Resources published" value={stats?.totalResources?.toLocaleString()} accent="#EBA614" />
          <StatCard loading={loading} label="Service categories" value={Object.keys(stats?.svcCounts || {}).length} accent="#a78bfa" />
        </div>

        {/* ── Main grid ── */}
        <div style={s.twoCol}>

          {/* Left: quick actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={s.card}>
              <h2 style={s.cardTitle}>Quick actions</h2>
              <div style={s.actionGrid}>
                <ActionCard to="/admin/facilities" label="Upload facilities CSV"   desc="Add or replace facility datasets" color="#3D80E8" />
                <ActionCard to="/admin/resources"  label="Manage resources"       desc="Add, edit or remove PDFs & links" color="#3ecf8e" />
                <ActionCard to="/service-finder"   label="Preview Service Finder" desc="See the public map" color="#EBA614" external />
                <ActionCard to="/admin/facilities" label="Delete a dataset"       desc="Remove a facility upload" color="#f87171" />
              </div>
            </div>

            {/* Facilities by service */}
            <div style={s.card}>
              <h2 style={s.cardTitle}>Facilities by service</h2>
              {loading ? <Skeleton rows={6} /> : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {CATEGORIES.flatMap(c => [c, ...c.subs]).map(item => {
                    const count = stats?.svcCounts?.[item.id] || 0;
                    const max   = Math.max(...Object.values(stats?.svcCounts || { x:1 }), 1);
                    return (
                      <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ width:200, fontSize:".82rem", color:"#c0c8d8", flexShrink:0 }}>{LABEL_OF[item.id]}</span>
                        <div style={{ flex:1, height:8, background:"#252b3b", borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${(count/max)*100}%`, background: count ? "#3D80E8" : "transparent", borderRadius:99, transition:"width .6s ease" }} />
                        </div>
                        <span style={{ width:52, textAlign:"right", fontSize:".82rem", fontWeight:700, color: count ? "#93c5fd" : "#3a4255" }}>
                          {count ? count.toLocaleString() : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: recent activity + dataset list */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={s.card}>
              <h2 style={s.cardTitle}>Recent activity</h2>
              {loading ? <Skeleton rows={6} /> : recent.length === 0 ? (
                <p style={s.muted}>Nothing uploaded yet.</p>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {recent.map((r, i) => (
                    <div key={i} style={s.actRow}>
                      <span style={{ ...s.actDot, background: r.type === "facility" ? "#3D80E8" : "#EBA614" }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:".88rem", color:"#e8eaf0", fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.label}</div>
                        <div style={{ fontSize:".74rem", color:"#8892a4", textTransform:"capitalize" }}>{r.type} · {r.sub}</div>
                      </div>
                      <span style={{ fontSize:".72rem", color:"#4a5568", whiteSpace:"nowrap" }}>{timeAgo(r.at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={s.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <h2 style={{ ...s.cardTitle, marginBottom:0 }}>Uploaded datasets</h2>
                <Link to="/admin/facilities" style={{ fontSize:".8rem", color:"#3D80E8", fontWeight:600 }}>Manage →</Link>
              </div>
              {loading ? <Skeleton rows={4} /> : stats?.datasets?.length === 0 ? (
                <p style={s.muted}>No datasets uploaded yet.</p>
              ) : (
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:".84rem" }}>
                  <thead>
                    <tr>
                      <th style={s.th}>Dataset</th>
                      <th style={s.th}>Facilities</th>
                      <th style={s.th}>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.datasets.map(d => (
                      <tr key={d.id} style={{ borderBottom:"1px solid #1e2535" }}>
                        <td style={s.td}>
                          <span style={{ fontWeight:600, color:"#e8eaf0" }}>{d.label}</span>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginTop:4 }}>
                            {(d.services || []).map(sv => (
                              <span key={sv} style={s.tagPill}>{LABEL_OF[sv] || sv}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ ...s.td, fontWeight:700, color:"#93c5fd" }}>{d.row_count?.toLocaleString()}</td>
                        <td style={{ ...s.td, color:"#8892a4", whiteSpace:"nowrap" }}>{timeAgo(d.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── data loading ── */
async function loadAll() {
  const [
    { count: totalFacilities },
    { count: totalResources },
    { data: datasets },
    { data: recentRes },
  ] = await Promise.all([
    supabase.from("facilities").select("*", { count: "exact", head: true }),
    supabase.from("resources").select("*",  { count: "exact", head: true }),
    supabase.from("facility_datasets").select("id,label,services,row_count,created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("resources").select("id,title,tab,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  // per-service counts
  const svcCounts = {};
  if (datasets) {
    for (const ds of datasets) {
      for (const svc of ds.services || []) {
        svcCounts[svc] = (svcCounts[svc] || 0) + ds.row_count;
      }
    }
  }

  return {
    stats: { totalFacilities: totalFacilities || 0, totalResources: totalResources || 0, datasets: datasets || [], svcCounts },
    recent: [
      ...(datasets || []).map(d => ({ type: "facility", label: d.label, sub: `${d.row_count?.toLocaleString()} facilities`, at: d.created_at })),
      ...(recentRes || []).map(r => ({ type: "resource", label: r.title, sub: r.tab, at: r.created_at })),
    ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 8),
  };
}

/* ── sub-components ── */
function StatCard({ label, value, accent, loading }) {
  return (
    <div style={{ ...s.statCard, borderTop: `3px solid ${accent}` }}>
      <div style={s.statLabel}>{label}</div>
      {loading
        ? <div style={{ height:36, background:"#252b3b", borderRadius:8, marginTop:4, animation:"pulse 1.5s infinite" }} />
        : <div style={{ ...s.statVal, color: accent }}>{value ?? "—"}</div>}
    </div>
  );
}

function ActionCard({ to, label, desc, color, external }) {
  const inner = (
    <div style={{ ...s.actionCard, borderLeft: `4px solid ${color}` }}>
      <div>
        <div style={{ fontWeight:700, fontSize:".92rem", color:"#e8eaf0" }}>{label}</div>
        <div style={{ fontSize:".78rem", color:"#8892a4" }}>{desc}</div>
      </div>
    </div>
  );
  return external
    ? <a href={to} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>{inner}</a>
    : <Link to={to} style={{ textDecoration:"none" }}>{inner}</Link>;
}

function Skeleton({ rows }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height:20, background:"#252b3b", borderRadius:6, opacity: 1 - i * 0.12 }} />
      ))}
    </div>
  );
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-ZA", { day:"numeric", month:"short" });
}

/* ── styles (exact same tokens as AdminDash) ── */
const s = {
  bg:         { minHeight:"100vh", background:"#0f1117", color:"#e8eaf0", fontFamily:"inherit" },
  main:       { maxWidth:1280, margin:"0 auto", padding:"32px 28px" },
  greeting:   { marginBottom:28 },
  h1:         { fontSize:"1.8rem", fontWeight:800, color:"#f0f2f8", margin:0 },
  muted:      { color:"#8892a4", fontSize:".9rem", marginTop:4 },
  statsGrid:  { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:28 },
  statCard:   { background:"#181c27", border:"1px solid #2a3147", borderRadius:12, padding:20 },
  statLabel:  { fontSize:".72rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".07em", color:"#8892a4", marginBottom:6 },
  statVal:    { fontSize:"2.2rem", fontWeight:800, fontFamily:"monospace" },
  twoCol:     { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"start" },
  card:       { background:"#181c27", border:"1px solid #2a3147", borderRadius:12, padding:24 },
  cardTitle:  { fontSize:"1rem", fontWeight:700, marginBottom:18, color:"#f0f2f8" },
  actionGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  actionCard: { background:"#0f1117", border:"1px solid #2a3147", borderRadius:10, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, transition:"background .15s", cursor:"pointer" },
  th:         { textAlign:"left", fontSize:".7rem", fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:"#8892a4", padding:"10px 12px", borderBottom:"1px solid #2a3147" },
  td:         { padding:"12px 12px", fontSize:".86rem", verticalAlign:"top", color:"#c0c8d8" },
  tagPill:    { display:"inline-block", padding:"2px 8px", borderRadius:99, fontSize:".68rem", fontWeight:700, background:"rgba(61,128,232,.15)", color:"#93c5fd", border:"1px solid rgba(61,128,232,.3)" },
  actRow:     { display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", borderBottom:"1px solid #1a2035" },
  actDot:     { width:8, height:8, borderRadius:"50%", marginTop:5, flexShrink:0 },
};