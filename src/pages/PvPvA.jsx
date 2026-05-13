import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqCta from "../components/FaqCta";
import CloudLayer from "../components/CloudLayer";

const ITEMS = [
  {
    id: "prep", icon: "/img/prep.png", title: "PrEP (Pre-Exposure Prophylaxis)",
    body: "PrEP is for HIV prevention, used by people who test negative for HIV to reduce their chances of infection before possible exposure.",
    keyPoints: ["Comes in different methods", "Requires regular clinic visits and HIV testing", "Does not prevent other STIs or pregnancy", "Can be used alongside condoms"]
  },
  {
    id: "pep", icon: "/img/pep.png", title: "PEP (Post-Exposure Prophylaxis)",
    body: "PEP is a short-term treatment started within 72 hours after possible exposure to HIV.",
    keyPoints: ["Taken for 28 days – one pill a day", "The sooner you start, the better", "Available at clinics and emergency departments", "Follow-up HIV testing required"]
  },
  {
    id: "art", icon: "/img/art.png", title: "ART (Antiretroviral Therapy)",
    body: "ART is a lifelong treatment for people living with HIV to control the virus.",
    keyPoints: ["Allows long, healthy lives", "When viral load is undetectable, HIV is not transmitted sexually", "Taken daily", "Regular clinic visits important"]
  },
];

export default function PvPvA() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <Navbar />
      <section className="pvpva-section">
        <div className="header-image-container pvpva-header-overlay">
          <img src="/img/mbackground.png" alt="PrEP vs PEP vs ART Header" className="header-image"
               style={{ width: "100%", maxHeight: 300, objectFit: "cover" }} />
          <div className="pvpva-header-text">
            <h1 className="pvpva-title">What is the difference between PrEP, PEP, and ART?</h1>
          </div>
        </div>
        <CloudLayer count={1} />
        <div className="pvpva-overlay">
          <div className="pvpva-grid">
            <div className="pvpva-left">
              {ITEMS.map(item => (
                <div key={item.id} className={`accordion-item visible${open === item.id ? " active" : ""}`}>
                  <div className="accordion-header" onClick={() => setOpen(open === item.id ? null : item.id)}>
                    <div className="icon-title-wrapper">
                      <div className="pvpva-icon"><img src={item.icon} alt={item.title} /></div>
                      <span>{item.title}</span>
                    </div>
                    <img src="/img/arrow.png" alt="arrow" className="d-arrow" />
                  </div>
                  <div className="accordion-content">
                    <p>{item.body}</p>
                    <h4 style={{ color: "#ffffff", fontSize: 20 }}>Key things to know:</h4>
                    <ul>{item.keyPoints.map(k => <li key={k}>{k}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="pvpva-right" style={{ textAlign: "center" }}>
              <img src="/img/pvp.png" alt="PrEP vs PEP vs ART" style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
      </section>
      <FaqCta />
      <Footer />
    </>
  );
}
