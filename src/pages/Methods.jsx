import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqCta from "../components/FaqCta";
import CloudLayer from "../components/CloudLayer";

const METHODS = [
  { id: "prep",   label: "Oral PrEP",       icon: "/img/pills.png" },
  { id: "inject", label: "Injectable PrEP",  icon: "/img/inject.png" },
  { id: "condom", label: "Condom",           icon: "/img/condom.png" },
  { id: "ring",   label: "PrEP Ring",        icon: "/img/ring.png" },
  { id: "cab",    label: "CAB-LA",           icon: "/img/cab.png" },
];

export default function Methods() {
  const [active, setActive] = useState("prep");

  return (
    <>
      <Navbar />
      <section className="methods-section">
        <CloudLayer count={2} />
        <div className="methods-overlay">
          <h1 className="methods-title">HIV Prevention Methods</h1>
          <div className="methods-glass">
            <div className="methods-grid">
              {METHODS.map(m => (
                <div
                  key={m.id}
                  className={`method-item${active === m.id ? " active" : ""}`}
                  onClick={() => setActive(m.id)}
                >
                  <img src={m.icon} alt={m.label} />
                  <p className="method-label">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="method-content">
        <OralPrep   active={active === "prep"} />
        <PrEPRing   active={active === "ring"} />
        <CabLA      active={active === "cab"} />
        <Len        active={active === "inject"} />
        <Condom     active={active === "condom"} />
      </div>

      <FaqCta />
      <Footer />
    </>
  );
}

function OralPrep({ active }) {
  return (
    <div className={`method-panel prep${active ? " active" : ""}`} id="prep">
      <h2 className="method-main-title">Oral pre-exposure prophylaxis: Oral PrEP</h2>
      <div className="method-details">
        <div className="method-left">
          <h3 className="method-subtitle">WHAT IS IT?</h3>
          <p className="method-text">Oral PrEP is a pill containing antiretroviral medication (ARVs), taken by HIV-negative people to prevent getting HIV.</p>
          <br/>
          <h3 className="method-subtitle">WHAT ARE THE SIDE EFFECTS?</h3>
          <p className="method-text">Some people may experience nausea, headaches, stomach discomfort, or vomiting. These usually go away within the first weeks.</p>
        </div>
        <div className="method-right"><img src="/img/preppic.png" alt="Oral PrEP" /></div>
      </div>
      <div className="method-extra">
        <div className="extra-left"><img src="/img/oralPrepIllust.png" alt="Oral PrEP Illustration" /></div>
        <div className="extra-right">
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW DOES IT WORK?</h4>
            <p className="extra-text">When taken every day, Oral PrEP can reduce the likelihood of getting HIV by more than 90%.</p>
          </div>
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW IS IT TAKEN?</h4>
            <p className="extra-text">One pill a day. After 7 days of daily use, you are preventing infection. Continue taking one pill every day.</p>
          </div>
          <div className="extra-item">
            <h4 className="extra-subtitle">WHAT YOU NEED TO KNOW:</h4>
            <p className="extra-text">Oral PrEP does not prevent STIs or pregnancy. It is for HIV-negative people and is safe!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrEPRing({ active }) {
  return (
    <div className={`method-panel ring${active ? " active" : ""}`} id="ring">
      <h2 className="method-main-title">PrEP Ring: DVR</h2>
      <div className="method-details">
        <h3 className="method-subtitle">WHAT IS IT?</h3>
        <p className="method-text">A flexible silicone ring containing ARV medication inserted into the vagina for 28 days.</p>
        <br/>
        <h3 className="method-subtitle">WHAT ARE THE SIDE EFFECTS?</h3>
        <p className="method-text">Possible mild side effects include UTI, vaginal discomfort, or itching. Usually go away after a few days.</p>
        <img src="/img/dvr.png" alt="PrEP Ring" />
      </div>
      <div className="method-extra">
        <div className="extra-right">
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW DOES IT WORK?</h4>
            <p className="extra-text">Slowly releases dapivirine into vaginal cells. Can reduce HIV risk by 35–50% when used correctly.</p>
          </div>
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW IS IT USED?</h4>
            <p className="extra-text">Insert into the vagina and leave for 28 days. Replace every 28 days with a new Ring.</p>
          </div>
        </div>
        <div className="extra-left"><img src="/img/dvr1.png" alt="PrEP Ring" /></div>
      </div>
    </div>
  );
}

function CabLA({ active }) {
  return (
    <div className={`method-panel cab${active ? " active" : ""}`} id="cab">
      <h2 className="method-main-title">PrEP injection: CAB-LA</h2>
      <div className="method-details">
        <div className="method-left">
          <h3 className="method-subtitle">WHAT IS IT?</h3>
          <p className="method-text">CAB-LA is a PrEP injection containing ARVs, taken by HIV-negative people to prevent getting HIV.</p>
          <br/>
          <h3 className="method-subtitle">WHAT ARE THE SIDE EFFECTS?</h3>
          <p className="method-text">Some people may have mild injection site reactions such as redness, pain, or swelling.</p>
        </div>
        <div className="method-right"><img src="/img/cab1.png" alt="CAB-LA" /></div>
      </div>
      <div className="method-extra">
        <div className="extra-left"><img src="/img/cab2.png" alt="CAB-LA" /></div>
        <div className="extra-right">
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW IS IT GIVEN?</h4>
            <p className="extra-text">First injection, then another after 1 month, then every 2 months. More than 90% effective.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Len({ active }) {
  return (
    <div className={`method-panel len${active ? " active" : ""}`} id="inject">
      <h2 className="method-main-title">PrEP injection: LEN</h2>
      <div className="method-details single-split">
        <div className="method-left">
          <h3 className="method-subtitle">WHAT IS IT?</h3>
          <p className="method-text">LEN is a 6-monthly HIV prevention option, more than 96% effective when used as prescribed.</p>
          <h3 className="method-subtitle">HOW DOES IT WORK?</h3>
          <p className="method-text">Slowly releases into your bloodstream, preventing HIV from multiplying.</p>
        </div>
        <div className="method-right">
          <img src="/img/len1.png" alt="Injectable PrEP" />
          <img src="/img/len2.png" alt="Injectable PrEP" />
        </div>
      </div>
      <div className="starting-len">
        <h3 className="starting-len-title">Starting LEN</h3>
        <img src="/img/LEN.png" alt="Starting LEN" className="starting-len-img" />
      </div>
    </div>
  );
}

function Condom({ active }) {
  const [openItem, setOpenItem] = useState(null);
  const items = [
    { id: "what", q: "WHAT IS IT?", a: "Condoms are a thin barrier used during sex to help prevent HIV and other STIs. They can also help prevent pregnancy." },
    { id: "effects", q: "WHAT ARE THE SIDE EFFECTS?", a: "Condoms usually have no side effects. Some people may experience irritation from latex — try non-latex alternatives." },
    { id: "how", q: "HOW DOES IT WORK?", a: "Creates a physical barrier preventing semen, vaginal fluids, and blood from passing between partners." },
    { id: "well", q: "HOW WELL DOES IT WORK?", a: "When used correctly every time, external and internal condoms are highly effective at preventing HIV and many STIs." },
  ];
  return (
    <div className={`method-panel condom${active ? " active" : ""}`} id="condom">
      <h2 className="method-main-title" style={{ textAlign: "center" }}>Condom</h2>
      <div className="method-containers">
        <div className="method-container">
          <h3 className="container-title">Internal Condom</h3>
          <img src="/img/condom1.png" alt="Internal Condom" />
          <ul className="container-list"><li>Sometimes called female condoms</li><li>Worn inside the vagina or anus</li></ul>
        </div>
        <div className="method-container">
          <h3 className="container-title">External Condom</h3>
          <img src="/img/condom2.png" alt="External Condom" />
          <ul className="container-list"><li>Sometimes called male condoms</li><li>Worn over the penis</li></ul>
        </div>
      </div>
      <div className="condom-accordion">
        {items.map(item => (
          <div key={item.id} className={`condom-item${openItem === item.id ? " active" : ""}`}>
            <div className="condom-header" onClick={() => setOpenItem(openItem === item.id ? null : item.id)}>
              <div className="icon-title-wrapper"><span>{item.q}</span></div>
              <img src="/img/arrow.png" alt="arrow" className="d-arrow" />
            </div>
            <div className="condom-content"><p>{item.a}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
