import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../supabase";
import { CATEGORIES, LABEL_OF } from "../data/serviceTaxonomy";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./ServiceFinder.css";

const PAGE = 30;
const SA_CENTER = [-28.6, 24.7];

const pinIcon = (hl) => L.divIcon({
  className: "",
  html: `<div class="sf-pin ${hl ? "hl" : ""}"></div>`,
  iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
});

const km = (a, b) => {
  const R = 6371, dLa = (b.lat - a.lat) * Math.PI / 180, dLn = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLn / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
};

export default function ServiceFinder() {
  const [all,      setAll]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cat,      setCat]      = useState(null);
  const [sub,      setSub]      = useState(null);
  const [expanded, setExpanded] = useState(new Set());
  const [q,        setQ]        = useState("");
  const [here,     setHere]     = useState(null);
  const [locMsg,   setLocMsg]   = useState("Location is optional — browse everything without it.");
  const [locBusy,  setLocBusy]  = useState(false);
  const [page,     setPage]     = useState(1);
  const [talkOpen, setTalkOpen] = useState(false);

  const mapEl   = useRef(null);
  const mapRef  = useRef(null);
  const cluster = useRef(null);
  const markers = useRef({});
  const youRef  = useRef(null);

  /* ── load all facilities (Supabase caps responses at 1000 rows) ── */
  useEffect(() => {
    (async () => {
      const rows = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase
          .from("facilities")
          .select("id,name,address,area,phone,email,type,lat,lng,services")
          .range(from, from + 999);
        if (error || !data?.length) break;
        rows.push(...data);
        if (data.length < 1000) break;
      }
      setAll(rows);
      setLoading(false);
    })();
  }, []);

  /* ── init map once ── */
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current).setView(SA_CENTER, 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    cluster.current = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 46 });
    map.addLayer(cluster.current);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  /* ── merge duplicates across datasets: same name + same spot = one facility ── */
  const merged = useMemo(() => {
    const byKey = new Map();
    for (const f of all) {
      const key = `${f.name.trim().toLowerCase()}|${f.lat.toFixed(4)}|${f.lng.toFixed(4)}`;
      const ex = byKey.get(key);
      if (!ex) {
        byKey.set(key, { ...f, services: [...new Set(f.services || [])] });
      } else {
        ex.services = [...new Set([...ex.services, ...(f.services || [])])];
        if (!ex.address && f.address) ex.address = f.address;
        if (!ex.area    && f.area)    ex.area    = f.area;
        if (!ex.phone   && f.phone)   ex.phone   = f.phone;
        if (!ex.email   && f.email)   ex.email   = f.email;
        if (!ex.type    && f.type)    ex.type    = f.type;
      }
    }
    return [...byKey.values()];
  }, [all]);

  /* ── counts per service for the sidebar badges (unique facilities) ── */
  const counts = useMemo(() => {
    const c = {};
    for (const f of merged) for (const s of f.services || []) c[s] = (c[s] || 0) + 1;
    return c;
  }, [merged]);

  /* ── filtering ── */
  const filtered = useMemo(() => {
    const tag = sub || cat;
    const needle = q.trim().toLowerCase();
    let list = merged.filter(f => {
      if (tag && !(f.services || []).includes(tag)) return false;
      if (needle && !((f.name + " " + (f.address || "") + " " + (f.area || "")).toLowerCase().includes(needle))) return false;
      return true;
    });
    if (here) {
      list = list.map(f => ({ ...f, _d: km(here, f) })).sort((a, b) => a._d - b._d);
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [merged, cat, sub, q, here]);


  /* ── sync markers whenever the filtered list changes ── */
  useEffect(() => {
    const map = mapRef.current, cl = cluster.current;
    if (!map || !cl) return;
    cl.clearLayers();
    markers.current = {};
    filtered.forEach(f => {
      const m = L.marker([f.lat, f.lng], { icon: pinIcon(false) })
        .bindPopup(
          `<div class="sf-pop"><b>${esc(f.name)}</b><br>` +
          `<span>${esc(f.address || f.area || "")}</span><br>` +
          `<a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}">Get directions &rarr;</a></div>`
        );
      m.on("click", () => {
        const card = document.getElementById("sf-card-" + f.id);
        if (card) {
          card.scrollIntoView({ block: "nearest", behavior: "smooth" });
          card.classList.add("hl");
          setTimeout(() => card.classList.remove("hl"), 1600);
        }
      });
      markers.current[f.id] = m;
      cl.addLayer(m);
    });
    if (filtered.length) {
      const b = L.latLngBounds(filtered.map(f => [f.lat, f.lng]));
      if (here) b.extend([here.lat, here.lng]);
      map.fitBounds(b.pad(0.15));
    }
  }, [filtered, here]);

  const hoverPin = useCallback((id, on) => {
    const m = markers.current[id];
    if (m) m.setIcon(pinIcon(on));
  }, []);

  const flyTo = useCallback((f) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([f.lat, f.lng], 15, { duration: .8 });
    const m = markers.current[f.id];
    if (m) setTimeout(() => m.openPopup(), 850);
    mapEl.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  /* ── geolocation (optional, graceful) ── */
  function locate() {
    if (!navigator.geolocation) {
      setLocMsg("Your browser does not support location — showing all facilities A to Z.");
      return;
    }
    setLocBusy(true);
    setLocMsg("Finding you…");
    navigator.geolocation.getCurrentPosition(
      p => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        setHere(pos);
        setPage(1);
        setLocMsg("Location found — facilities sorted by distance.");
        setLocBusy(false);
        const map = mapRef.current;
        if (map) {
          if (youRef.current) map.removeLayer(youRef.current);
          youRef.current = L.marker([pos.lat, pos.lng], {
            icon: L.divIcon({ className: "", html: '<div class="sf-you"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
          }).addTo(map).bindPopup("You are here");
        }
      },
      () => {
        setLocMsg("No problem — you can still browse and search all facilities.");
        setLocBusy(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }

  function pickCat(c) {
    if (c.subs.length) {
      setExpanded(prev => {
        const n = new Set(prev);
        n.has(c.id) ? n.delete(c.id) : n.add(c.id);
        return n;
      });
    }
    if (cat === c.id && !sub && !c.subs.length) setCat(null);
    else { setCat(c.id); setSub(null); }
    setPage(1);
  }
  function pickSub(cId, sId) {
    if (sub === sId) { setSub(null); setCat(cId); }
    else { setCat(cId); setSub(sId); }
    setPage(1);
  }
  function clearAll() { setCat(null); setSub(null); setQ(""); setPage(1); }

  const tag = sub || cat;
  const shown = filtered.slice(0, page * PAGE);

  return (
    <>
      <Navbar />
      <main className="sf">
        {/* ── hero ── */}
        <section className="sf-hero">
          <h1>Find care near you</h1>
          <p>PrEP, HIV testing, family planning and support services across South Africa -
            free, friendly and confidential. Pick a service, or search your area.</p>
          <form className="sf-search" onSubmit={e => e.preventDefault()}>
            <input type="search" value={q} onChange={e => { setQ(e.target.value); setPage(1); }}
                   placeholder="Search by facility name or suburb, e.g. Hillbrow"
                   aria-label="Search facilities" />
            <button type="submit" className="sf-btn sf-btn-sun">Search</button>
          </form>
          <div className="sf-locate">
            <button className="sf-btn sf-btn-ghost" onClick={locate} disabled={locBusy}>
              {here ? "✓ Location on" : "📍 Use my location"}
            </button>
          </div>
          <div className="sf-locmsg" aria-live="polite">{locMsg}</div>
        </section>

        {/* ── app grid ── */}
        <div className="sf-app">
          <aside className="sf-side" aria-label="Filter by service">
            <h2>Services</h2>
            {CATEGORIES.map(c => (
              <div key={c.id}>
                <button
                  className={`sf-cat ${cat === c.id && !sub ? "on" : ""} ${expanded.has(c.id) ? "exp" : ""}`}
                  onClick={() => pickCat(c)} aria-expanded={expanded.has(c.id)}>
                  <span>{c.label}</span>
                  <span className="sf-cat-right">
                    <span className="n">{counts[c.id] || 0}</span>
                    {c.subs.length > 0 && <span className="car">▾</span>}
                  </span>
                </button>
                {c.subs.length > 0 && (
                  <div className={`sf-subs ${expanded.has(c.id) ? "open" : ""}`}>
                    {c.subs.map(su => (
                      <button key={su.id}
                        className={`sf-sub ${sub === su.id ? "on" : ""}`}
                        onClick={() => pickSub(c.id, su.id)}>
                        <span>{su.label}</span>
                        <span className="n">{counts[su.id] || 0}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="sf-btn sf-btn-green sf-talk" onClick={() => setTalkOpen(true)}>
              💬 Talk to somebody
            </button>
            <button className="sf-clear" onClick={clearAll}>Clear all filters</button>
          </aside>

          <div className="sf-mapcol">
            <div ref={mapEl} className="sf-map" aria-label="Map of facilities" />
            <div className="sf-hint"><b>Tip:</b> tap a pin to see the facility, or pick a service
              on the left to narrow the map. Numbered circles are groups - tap to zoom in.</div>
          </div>

          <section className="sf-res" aria-label="Facility results">
            <div className="sf-reshead">
              <h2>{here ? "Facilities near you" : "All facilities"}</h2>
              <div className="sub">
                {loading ? "Loading…" :
                  `${filtered.length.toLocaleString()} ${filtered.length === 1 ? "result" : "results"}` +
                  (tag ? ` · ${LABEL_OF[tag]}` : "") + (here ? " · by distance" : " · A to Z")}
              </div>
            </div>

            <div className="sf-cards">
              {shown.map(f => (
                <article key={f.id} id={"sf-card-" + f.id} className="sf-card"
                         onMouseEnter={() => hoverPin(f.id, true)}
                         onMouseLeave={() => hoverPin(f.id, false)}>
                  <h3>{f.name}</h3>
                  <div className="addr">📍 {f.address || f.area || "Address on map"}</div>
                  {f._d !== undefined && (
                    <span className="dist">{f._d < 1 ? `${(f._d * 1000).toFixed(0)} m` : `${f._d.toFixed(1)} km`}</span>
                  )}
                  <div className="svcs">
                    {f.type && <span className="svc type">{f.type}</span>}
                    {(f.services || []).filter(s => LABEL_OF[s]).map(s =>
                      <span key={s} className="svc">{LABEL_OF[s]}</span>)}
                  </div>
                  <div className="acts">
                    <a className="sf-btn sf-btn-blue sm" target="_blank" rel="noopener noreferrer"
                       href={`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`}>Directions</a>
                    {f.phone && <a className="sf-btn sf-btn-line sm" href={`tel:${f.phone.replace(/\s/g, "")}`}>📞 Call</a>}
                    {f.email && <a className="sf-btn sf-btn-line sm" href={`mailto:${f.email}`}>✉ Email</a>}
                    <button className="sf-btn sf-btn-line sm" onClick={() => flyTo(f)}>Map</button>
                  </div>
                </article>
              ))}
            </div>

            {shown.length < filtered.length && (
              <button className="sf-btn sf-btn-line sf-more" onClick={() => setPage(p => p + 1)}>
                Show more ({(filtered.length - shown.length).toLocaleString()} left)
              </button>
            )}

            {!loading && filtered.length === 0 && (
              <div className="sf-empty">
                <h3>No facilities match yet</h3>
                <p>Try clearing a filter or searching a nearby suburb.</p>
                <button className="sf-btn sf-btn-blue sm" onClick={clearAll}>Clear all filters</button>
              </div>
            )}
          </section>
        </div>

        <p className="sf-privacy">
          <b>Privacy:</b> your location never leaves your device - it is only used in your
          browser to sort facilities by distance.
        </p>
      </main>

      {/* ── Talk to somebody ── */}
      {talkOpen && (
        <div className="sf-overlay" onClick={() => setTalkOpen(false)}>
          <div className="sf-dialog" role="dialog" aria-label="Talk to somebody" onClick={e => e.stopPropagation()}>
            <div className="head">
              <button className="x" onClick={() => setTalkOpen(false)} aria-label="Close">✕</button>
              <h3>Talk to somebody</h3>
              <div className="area">Free, confidential helplines - every day</div>
            </div>
            <div className="body">
              <Help name="National AIDS Helpline" sub="HIV, PrEP & treatment questions · 24/7" tel="0800 012 322" />
              <Help name="GBV Command Centre" sub="Gender-based violence support · 24/7" tel="0800 428 428" />
              <Help name="Childline South Africa" sub="For children & teens · 24/7" tel="116" />
              <Help name="SADAG Mental Health Line" sub="Counselling & referrals" tel="011 234 4837" />
              <div className="note">If you are in immediate danger, call <b>10111</b> (police) or <b>112</b> from any cellphone.</div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

function Help({ name, sub, tel }) {
  return (
    <div className="sf-help">
      <div><b>{name}</b><span>{sub}</span></div>
      <a href={`tel:${tel.replace(/\s/g, "")}`}>{tel}</a>
    </div>
  );
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}