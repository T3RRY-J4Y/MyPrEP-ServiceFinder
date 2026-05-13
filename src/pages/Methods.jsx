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
        <OralPrep active={active === "prep"} />
        <Len      active={active === "inject"} />
        <Condom   active={active === "condom"} />
        <PrEPRing active={active === "ring"} />
        <CabLA    active={active === "cab"} />
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
          <p className="method-text">
            Oral PrEP is a pill containing antiretroviral medication (ARVs), taken by HIV-negative people to prevent getting HIV.
          </p>
          <br />
          <h3 className="method-subtitle">WHAT ARE THE SIDE EFFECTS?</h3>
          <p className="method-text">
            Some people may experience nausea, headaches, stomach discomfort, or vomiting. These usually go away within the first weeks of use. If severe or persistent, visit your clinic.
          </p>
        </div>
        <div className="method-right">
          <img src="/img/preppic.png" alt="Oral PrEP" />
        </div>
      </div>
      <div className="method-extra">
        <div className="extra-left">
          <img src="/img/oralPrepIllust.png" alt="Oral PrEP Illustration" />
        </div>
        <div className="extra-right">
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW DOES IT WORK?</h4>
            <p className="extra-text">
              If a person is HIV-negative, the medication in oral PrEP prevents the cells in the body from being infected with HIV. When taken every day, oral PrEP can reduce the likelihood of getting HIV by more than 90%.
            </p>
          </div>
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW IS IT TAKEN?</h4>
            <p className="extra-text">
              Oral PrEP is one pill a day for as long as you need it. After taking one pill a day for 7 days, you are preventing infection. (Use condoms or abstain during this time.) Thereafter, continue taking one pill a day every day. When you want to stop using oral PrEP, continue taking one pill a day for 7 days after your last exposure to HIV.
            </p>
          </div>
          <div className="extra-item">
            <h4 className="extra-subtitle">WHAT YOU NEED TO KNOW:</h4>
            <p className="extra-text">
              If privacy is important, hide the pills. Oral PrEP does not prevent STIs or pregnancy. Oral PrEP is for HIV-negative people and is safe!
            </p>
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
          <p className="method-text">
            LEN is a 6-monthly injectable HIV prevention option, it is for people who test negative for HIV. LEN is more than 96% effective in preventing HIV if it is used as prescribed!
          </p>
          <br />
          <h3 className="method-subtitle">WHAT ARE THE SIDE EFFECTS?</h3>
          <p className="method-text">
            Using LEN for PrEP is like getting any other injections. Some people may have a mild or moderate injection site reaction, such as redness, pain, a small lump or swelling. A small number of people may experience nausea or feeling sick but most of these side effects are mild or moderate and will go away in the first month and get less over time. If you experience any of these reactions, your healthcare provider may be able to help you manage it.
          </p>
          <br />
          <h3 className="method-subtitle">HOW DOES IT WORK?</h3>
          <p className="method-text">
            The medicine, lenacapavir, is slowly released into your bloodstream after receiving the injection. It prevents HIV from multiplying. If HIV cannot multiply, the virus dies. It is more than 96% effective at preventing HIV if taken as prescribed.
          </p>
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
    {
      id: "what",
      q: "WHAT IS IT?",
      a: `Condoms are a thin barrier used during sex to help prevent HIV and other sexually transmitted infections (STIs). Condoms can also help prevent pregnancy.

There are two main types:
- External condoms (sometimes called male condoms) – worn over the penis
- Internal condoms (sometimes called female condoms) – worn inside the vagina or anus

Both types can be used during vaginal sex, anal sex, and oral sex.`
    },
    {
      id: "effects",
      q: "WHAT ARE THE SIDE EFFECTS?",
      a: `Condoms usually have no side effects.

Some people may experience irritation or an allergic reaction to latex or certain lubricants. If this happens:
- Try non-latex condoms
- Try a different lubricant
- Speak to a healthcare provider if irritation continues

Internal condoms are latex-free and may be a good option for people with latex sensitivity.`
    },
    {
      id: "how",
      q: "HOW DOES IT WORK?",
      a: `Condoms work by creating a physical barrier that helps stop bodily fluids from passing between partners during sex.

This lowers the chance of:
- HIV transmission
- STI transmission
- Pregnancy

External condoms collect semen outside the body. Internal condoms line the vagina or anus and help prevent fluids from entering the body.`
    },
    {
      id: "well",
      q: "HOW WELL DOES IT WORK?",
      a: `When used correctly every time:
- External condoms are highly effective at preventing HIV and many STIs
- Internal condoms are also effective when used properly

Effectiveness depends on correct use from start to finish, every time you have sex.`
    },
  ];

  return (
    <div className={`method-panel condom${active ? " active" : ""}`} id="condom">
      <h2 className="method-main-title" style={{ textAlign: "center" }}>Condom</h2>

      <div className="method-containers">
        <div className="method-container">
          <h3 className="container-title">Internal Condom</h3>
          <img src="/img/condom1.png" alt="Internal Condom" />
          <ul className="container-list">
            <li>Sometimes called female condoms</li>
            <li>Worn inside the vagina or anus</li>
          </ul>
        </div>
        <div className="method-container">
          <h3 className="container-title">External Condom</h3>
          <img src="/img/condom2.png" alt="External Condom" />
          <ul className="container-list">
            <li>Sometimes called male condoms</li>
            <li>Worn over the penis</li>
          </ul>
        </div>
      </div>

      <div className="center-text">
        <p>Do not use an internal and external condom at the same time, as this can cause tearing.</p>
      </div>

      <div className="condom-accordion">
        {items.map(item => (
          <div key={item.id} className={`condom-item${openItem === item.id ? " active" : ""}`}>
            <div className="condom-header" onClick={() => setOpenItem(openItem === item.id ? null : item.id)}>
              <div className="icon-title-wrapper"><span>{item.q}</span></div>
              <img src="/img/arrow.png" alt="arrow" className="d-arrow" />
            </div>
            <div className="condom-content">
              <p style={{ whiteSpace: "pre-line" }}>{item.a}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="split-section">
        <div className="split-left">
          <h4 className="split-subtitle">HOW IS IT USED?</h4>
          <p className="extra-text">
            <strong style={{ color: "#3D80E8" }}>External condoms</strong>
            <ul style={{ marginLeft: 25 }}>
              <li>Use a new condom every time you have sex</li>
              <li>Put it on before any genital contact</li>
              <li>Use water-based or silicone-based lubricant</li>
              <li>Hold the base when pulling out after sex and dispose of it safely</li>
            </ul>
            <br />
            <strong>Internal condoms</strong>
            <ul style={{ marginLeft: 25 }}>
              <li>Insert the condom into the vagina or anus before sex</li>
              <li>Make sure the inner ring is in place and the outer ring stays outside the body</li>
              <li>Guide the penis into the condom opening during sex</li>
              <li>Twist and remove after sex, then dispose of it safely</li>
            </ul>
          </p>
        </div>
        <div className="split-right">
          <div className="sticky-note">
            <h4 className="sticky-note-title">REMEMBER THAT</h4>
            <br />
            <li>Condoms work best when used correctly every time you have sex</li>
            <li>Condoms are the only option here that help prevent HIV, STIs, and pregnancy at the same time</li>
            <li>If a condom breaks or slips, contact your healthcare provider as soon as possible.</li>
          </div>
        </div>
      </div>

      <div className="final-section">
        <h3 className="final-title">WHAT YOU NEED TO KNOW</h3>
        <p className="final-text">
          Condoms can be used alone or with other HIV prevention options, such as PrEP.
          They are widely available at clinics, pharmacies, and some community services.
          The right size, correct insertion, and correct use make a big difference.
        </p>
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
        <p className="method-text">
          The Ring is made of flexible silicone and contains antiretroviral (ARV) medication used for HIV prevention. It is inserted into the vagina for 28 days and provides HIV prevention during vaginal sex.
        </p>
        <br />
        <h3 className="method-subtitle">WHAT ARE THE SIDE EFFECTS?</h3>
        <p className="method-text">
          Some users may experience urinary tract infection, discomfort in the vagina or lower part of the belly, or itching, which are possible side effects of using the Ring. These side effects are mostly mild and go away after a few days without needing to remove the Ring. You should not be able to feel the Ring if it is inserted correctly. Visit your clinic if you continue to experience discomfort while using the Ring.
        </p>
        <img src="/img/dvr.png" alt="PrEP Ring" />
      </div>

      <div className="method-extra">
        <div className="extra-right">
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW DOES IT WORK?</h4>
            <p className="extra-text">
              The Ring slowly releases the ARV, dapivirine, into vaginal cells, providing protection from HIV. When the Ring is kept in place in the vagina for 28 days, it can reduce the likelihood of a woman getting HIV through vaginal sex by 35% (further studies have shown the Ring may be over 50% effective if used correctly and consistently.)
            </p>
          </div>
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW IS IT USED?</h4>
            <p className="extra-text">
              The Ring is inserted in the vagina and left there for 28 days. It is replaced every 28 days with a new Ring. The Ring takes about 24 hours before you have maximum protection — use condoms or abstain during this time.
            </p>
          </div>
        </div>
        <div className="extra-left">
  <div className="image-wrapper">
    <img src="/img/dvr1.png" alt="PrEP Ring" style={{ maxWidth: "100%", height: "auto", display: "block" }} />
  </div>
</div>
      </div>

      <div className="method-notes split-right">
        <div className="final-section note-box">
          <h4 className="final-title">WHAT YOU NEED TO KNOW</h4>
          <p className="final-text">
            The Ring can be worn discreetly, does not interfere with sex, and is safe. It does not protect against STIs or pregnancy.
          </p>
        </div>
        <div className="sticky-note">
          <h4 className="sticky-title">REMEMBER THAT</h4>
          <p>
            The Ring does not protect against STIs or pregnancy. Use condoms and contraception. The Ring is for people who are HIV-negative. The Ring only provides protection from HIV for a woman during vaginal sex.
          </p>
        </div>
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
          <p className="method-text">
            CAB-LA is a PrEP injection containing antiretroviral medication (ARVs), taken by HIV-negative people to prevent HIV.
          </p>
          <br />
          <h3 className="method-subtitle">WHAT ARE THE SIDE EFFECTS?</h3>
          <p className="method-text">
            Some people may have a mild or moderate injection site reaction, such as redness, pain, or swelling where the injection is given. Some people may experience nausea or feeling sick but most of these side effects are mild or moderate and will go away within the first weeks of use. If you experience any of these reactions, your healthcare provider may be able to help you manage it.
          </p>
        </div>
        <div className="method-right">
          <img src="/img/cab1.png" alt="CAB-LA" />
        </div>
      </div>

      <div className="method-extra">
        <div className="extra-left">
          <img src="/img/cab2.png" alt="CAB-LA" />
        </div>
        <div className="extra-right">
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW IS IT GIVEN?</h4>
            <p className="extra-text">
              The medication, CAB-LA, is injected into the buttocks by a healthcare provider. After receiving your first injection, you have to get another injection after 1 month; then, you only need an injection every 2 months.
              <br /><br />
              <strong>Speak to your healthcare provider before stopping the CAB-LA, as you will have to switch to a different method for up to a year to prevent ARV resistance.</strong>
            </p>
          </div>
          <div className="extra-item">
            <h4 className="extra-subtitle">HOW DOES IT WORK?</h4>
            <p className="extra-text">
              If a person is HIV-negative, the medication in the PrEP injection slowly releases into the body and blood, protecting the cells in the whole body from being infected with HIV. In most people, the medication starts to protect the cells in the body within one week of the first injection. The PrEP injection is more than 90% effective at preventing HIV.
            </p>
          </div>
        </div>
      </div>

      <div className="method-notes">
        <div className="note-box">
          <h4 className="note-title">WHAT YOU NEED TO KNOW</h4>
          <ul className="note-list">
            <li>You need to make a commitment to going back to your clinic every 2 months to get another injection.</li>
            <li>The PrEP injection only works for 2 months, so you have to continue with the injections for as long as you need it.</li>
            <li>The PrEP injection is very safe and effective!</li>
            <li>Once you stop using the PrEP injection, you will have to use a different method for up to 1 year.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}