import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqCta from "../components/FaqCta";
import CloudLayer from "../components/CloudLayer";

const FILTERS = [
  { id: "oralprep",    label: "Oral PrEP" },
  { id: "prepring",    label: "PrEP Ring" },
  { id: "cabb",        label: "CAB-LA" },
  { id: "lenn",        label: "LEN" },
  { id: "pep",         label: "PEP" },
  { id: "sexualhealth",label: "HIV Prevention Ambassador Training" },
];

const CARDS = [
  { cat: "oralprep",     title: "Online Course for General Awareness Regarding Oral PrEP" },
  { cat: "oralprep",     title: "Online Course for the Clinical Management of Oral PrEP" },
  { cat: "oralprep",     title: "The Counsellor's Guide to Oral PrEP" },
  { cat: "oralprep",     title: "Overview of Oral PrEP for Peers" },
  { cat: "oralprep",     title: "Clinical Management of Oral PrEP for Pregnant and Breastfeeding Women" },
  { cat: "oralprep",     title: "Recording, Capturing and Reporting Process for Oral PrEP Data" },
  { cat: "prepring",     title: "Clinical Management of the Dapivirine Vaginal Ring" },
  { cat: "pep",          title: "Basics of Post-Exposure Prophylaxis (PEP)" },
  { cat: "cabb",         title: "Clinical Management of Cabotegravir Long-Acting Injectable (CAB-LA)" },
  { cat: "lenn",         title: "Clinical Management of Lenacapavir (LEN)" },
  { cat: "sexualhealth", title: "HIV Prevention Ambassador Training: Interactive Virtual Oral PrEP Sessions" },
];

const URL = "https://myprep-learning.co.za/register/";

export default function Training() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  const visible = CARDS.filter(c => {
    const catMatch    = !activeCategory || c.cat === activeCategory;
    const searchMatch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <>
      <Navbar />
      <section className="pvpva-section">
        <div className="header-image-container pvpva-header-overlay">
          <img src="/img/mbackground.png" alt="Training" className="header-image"
               style={{ width: "100%", maxHeight: 300, objectFit: "cover" }} />
          <div className="pvpva-header-text"><h1 className="pvpva-title">Training</h1></div>
        </div>
        <CloudLayer count={1} />
        <div className="training-overlay">
          <div className="training-search">
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="training-filters">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={`training-filter${activeCategory === f.id ? " active" : ""}`}
                onClick={() => setActiveCategory(activeCategory === f.id ? null : f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="training-content">
            {visible.map((c, i) => (
              <a key={i} href={URL} target="_blank" rel="noopener noreferrer">
                <div className="training-card"><h3>{c.title}</h3></div>
              </a>
            ))}
            {visible.length === 0 && (
              <p style={{ color: "#888", textAlign: "center", width: "100%", padding: 40 }}>No courses match.</p>
            )}
          </div>
        </div>
      </section>
      <FaqCta />
      <Footer />
    </>
  );
}
