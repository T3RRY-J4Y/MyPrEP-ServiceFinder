import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqCta from "../components/FaqCta";
import CloudLayer from "../components/CloudLayer";

const TABS = [
  { id: "policy",    label: "Implementation Guidelines" },
  { id: "job-aids",  label: "Job Aids" },
  { id: "iec",       label: "IEC Materials" },
  { id: "community", label: "Community Engagement" },
];

const FILTERS = [
  { id: "oral",       label: "Oral PrEP" },
  { id: "len",        label: "LEN" },
  { id: "pep",        label: "PEP" },
  { id: "dvr",        label: "Prep Ring (DVR)" },
  { id: "cabla",      label: "CAB-LA" },
  { id: "prepchoice", label: "PrEP Choice" },
  { id: "srhr",       label: "SRHR" },
];

export default function Resources() {
  const [resources,    setResources]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeTab,    setActiveTab]    = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [search,       setSearch]       = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) setError(error.message);
      else setResources(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const visible = resources.filter(r => {
    const tags = typeof r.tags === "string"
      ? JSON.parse(r.tags || "[]")
      : (r.tags || []);
    const tabMatch    = !activeTab    || r.tab === activeTab;
    const filterMatch = !activeFilter || tags.includes(activeFilter);
    const searchMatch = !search       || r.title.toLowerCase().includes(search.toLowerCase());
    return tabMatch && filterMatch && searchMatch;
  });

  return (
    <>
      <Navbar />
      <section className="pvpva-section">
        <div className="header-image-container pvpva-header-overlay">
          <img src="/img/mbackground.png" alt="Resources Header" className="header-image"
               style={{ width: "100%", maxHeight: 300, objectFit: "cover" }} />
          <div className="pvpva-header-text">
            <h1 className="pvpva-title">Resources</h1>
          </div>
        </div>
        <CloudLayer count={1} />

        <div className="resource-library">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Resources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filters">
            {FILTERS.map(f => (
              <div
                key={f.id}
                className={`filter-chip${activeFilter === f.id ? " active" : ""}`}
                onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
              >
                {f.label}
              </div>
            ))}
          </div>

          <div className="tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab${activeTab === t.id ? " active" : ""}`}
                onClick={() => setActiveTab(activeTab === t.id ? null : t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="resources" id="resourceContainer">
            {loading && (
              <p style={{ textAlign: "center", padding: 40, width: "100%" }}>Loading resources…</p>
            )}
            {error && (
              <p style={{ textAlign: "center", color: "#c00", padding: 40, width: "100%" }}>
                Failed to load: {error}
              </p>
            )}
            {!loading && !error && visible.length === 0 && (
              <p style={{ textAlign: "center", color: "#888", padding: 40, width: "100%" }}>
                No resources match your filters.
              </p>
            )}
            {visible.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer">
                <div className="card">
                  <span className="card-title">{r.title}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <FaqCta />
      <Footer />
    </>
  );
}