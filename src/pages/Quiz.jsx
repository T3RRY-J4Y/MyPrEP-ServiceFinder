import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const blue   = "#3D80E8";
const yellow = "#EBA614";
const bg     = "linear-gradient(180deg, #7ab3ef 0%, #c7ddf5 100%)";

// ── Method detail data ────────────────────────────────────────
const METHOD_DETAILS = {
  oral: {
    label: "Oral PrEP", icon: "/img/pills.png", color: "#3D80E8",
    what: "Oral PrEP is a pill containing antiretroviral medication (ARVs), taken by HIV-negative people to prevent getting HIV. It contains two anti-HIV medicines: emtricitabine and tenofovir.",
    how: "When taken every day, the medication prevents the cells in your body from being infected with HIV. It can reduce the likelihood of getting HIV by more than 90%.",
    used: "One pill every day for as long as you need it. After 7 days of daily use, you are preventing infection. When you want to stop, continue taking one pill a day for 7 days after your last exposure.",
    effectiveness: "More than 90% effective when taken daily",
    sideEffects: "Most people have no side effects. Some may experience headache, nausea, tiredness, or stomach discomfort in the first few weeks. These usually go away on their own.",
    considerations: [
      "Does not prevent STIs or pregnancy — use condoms too",
      "For HIV-negative people only",
      "If privacy is important, store pills safely",
      "Requires regular HIV testing and clinic visits",
      "Can be started and stopped as needed",
    ],
    process: [
      { time: "Day 1", detail: "HIV test — if negative, receive one month's supply" },
      { time: "1 month", detail: "Follow-up visit, receive 3-month supply" },
      { time: "Every 3 months", detail: "HIV test and 3-month supply" },
    ],
    faqs: [
      { q: "How soon does it work?", a: "Protection builds up after 7 days of daily use." },
      { q: "Can I use it during pregnancy?", a: "Yes. Oral PrEP can be used during pregnancy and breastfeeding." },
      { q: "What if I miss a dose?", a: "Take it as soon as you remember. Never take two doses at once." },
    ],
  },
  ring: {
    label: "PrEP Ring (DVR)", icon: "/img/ring.png", color: "#EBA614",
    what: "The PrEP ring is a flexible silicone ring containing dapivirine (an ARV). It is inserted into the vagina and worn for 28 days to reduce the chances of acquiring HIV during vaginal sex.",
    how: "The ring slowly releases the ARV dapivirine into vaginal tissues, providing continuous protection from HIV without needing to remember a daily pill.",
    used: "Insert the ring into the vagina and leave it for 28 days. Replace with a new ring every 28 days. The ring takes about 24 hours to reach maximum protection — use condoms or abstain during this time.",
    effectiveness: "35–50% effective — higher with consistent use",
    sideEffects: "Some users may experience mild UTI, vaginal discomfort, or itching. These are usually mild and go away after a few days without removing the ring.",
    considerations: [
      "For vaginal sex only — does not protect during anal sex",
      "Does not prevent STIs or pregnancy",
      "Cannot be used during pregnancy or breastfeeding",
      "Can be worn discreetly — partner does not need to know",
      "Most people and their partners do not feel it",
    ],
    process: [
      { time: "Day 1", detail: "HIV test — if negative, insert first ring" },
      { time: "Every 28 days", detail: "Replace with a new ring at clinic" },
      { time: "Every 3 months", detail: "Follow-up HIV test and new supply" },
    ],
    faqs: [
      { q: "Can my partner feel the ring?", a: "The ring sits high in the vagina and most partners do not feel it." },
      { q: "Can I use contraceptives with the ring?", a: "Yes, with most forms except another vaginal ring." },
      { q: "What if the ring falls out?", a: "Rinse it with clean water and reinsert. Contact your clinic if concerned." },
    ],
  },
  cabla: {
    label: "CAB-LA Injection", icon: "/img/inject.png", color: "#3D80E8",
    what: "CAB-LA is a PrEP injection containing cabotegravir (an ARV), taken by HIV-negative people to prevent HIV. It is given by a healthcare provider every 2 months.",
    how: "The medication slowly releases into your body and bloodstream after the injection, protecting your cells from HIV infection. In most people, protection begins within one week of the first injection.",
    used: "Injected into the buttocks by a healthcare provider. First injection on Day 1, second after 1 month, then every 2 months. You must continue clinic visits every 2 months for as long as you need protection.",
    effectiveness: "More than 90% effective",
    sideEffects: "Some people may have pain, redness, or swelling at the injection site. Some may experience nausea. These usually go away within the first weeks.",
    considerations: [
      "No daily pill required",
      "Must attend clinic every 2 months",
      "Does not prevent STIs or pregnancy",
      "Speak to provider before stopping — you may need another method for up to 1 year",
      "Currently available through research studies in some areas",
    ],
    process: [
      { time: "Day 1", detail: "HIV test — if negative, first injection" },
      { time: "1 month", detail: "Second injection" },
      { time: "Every 2 months", detail: "Ongoing injection at clinic" },
    ],
    faqs: [
      { q: "What if I miss my injection appointment?", a: "Return to the clinic as soon as possible. Missing injections reduces protection." },
      { q: "Can I stop at any time?", a: "Speak to your provider first — you may need another method for up to 1 year after stopping." },
      { q: "Does it prevent pregnancy?", a: "No. Use contraception alongside CAB-LA." },
    ],
  },
  len: {
    label: "Lenacapavir (LEN)", icon: "/img/inject.png", color: "#7c3aed",
    what: "Lenacapavir is a long-acting HIV prevention injection given every 6 months. After an initial start phase with tablets and injections, it provides highly effective protection against HIV.",
    how: "Lenacapavir stops HIV from multiplying in the body. It is slowly released into your bloodstream after injection, preventing HIV from establishing an infection.",
    used: "Day 1: Two tablets + two injections. Day 2: Two tablets at home. Then two injections every 6 months. No tablets are needed after the start phase.",
    effectiveness: "More than 96% effective — the most effective PrEP option available",
    sideEffects: "Common reactions include redness, pain, swelling, or a small lump under the skin at the injection site. These are usually mild and go away on their own.",
    considerations: [
      "Only 2 clinic visits per year after initiation",
      "Most discreet long-acting option",
      "Does not prevent STIs or pregnancy",
      "Available at selected clinics during early rollout",
      "Can be used during pregnancy and breastfeeding",
    ],
    process: [
      { time: "Day 1", detail: "Two tablets + two injections at clinic" },
      { time: "Day 2", detail: "Two tablets taken at home" },
      { time: "Every 6 months", detail: "Two injections at clinic" },
    ],
    faqs: [
      { q: "Is it available everywhere?", a: "Currently available at selected clinics. Availability will expand over time." },
      { q: "What if I stop using it?", a: "Lenacapavir stays in your body for months. Your provider will guide you on switching methods." },
      { q: "Can I use it during pregnancy?", a: "Yes. Lenacapavir can be used during pregnancy and breastfeeding." },
    ],
  },
};

// ── Method info ───────────────────────────────────────────────
const METHOD_INFO = [
  {
    id: "pills", label: "Pills", icon: "/img/pills.png",
    content: {
      title: "Oral PrEP", name: "TDF/FTC",
      tagline: "Very effective at preventing HIV from any kind of exposure.",
      schedule: "One pill every day for as long as you need it",
      process: [
        { time: "Day 1:", detail: "HIV test, and if negative, receive one month's supply of oral PrEP" },
        { time: "After 1 month:", detail: "Follow-up visit to clinic, receive a 3-month supply" },
        { time: "Every 3 months:", detail: "Follow-up visit, HIV test, and 3-month supply" },
      ],
      note: "Works best if the pill is taken every day.",
    }
  },
  {
    id: "rings", label: "Rings", icon: "/img/ring.png",
    content: {
      title: "PrEP Ring (DVR)", name: "Dapivirine Vaginal Ring",
      tagline: "Reduces the risk of HIV during vaginal sex by 35–50%.",
      schedule: "Insert ring into vagina, replace every 28 days",
      process: [
        { time: "Day 1:", detail: "HIV test, and if negative, receive first ring — insert into vagina" },
        { time: "Every 28 days:", detail: "Replace with a new ring at clinic visit" },
        { time: "Every 3 months:", detail: "Follow-up HIV test and new supply of rings" },
      ],
      note: "Does not protect against STIs or pregnancy. For vaginal sex only.",
    }
  },
  {
    id: "injections", label: "Injections", icon: "/img/inject.png",
    content: {
      title: "Injectable PrEP", name: "CAB-LA / Lenacapavir",
      tagline: "More than 90–96% effective at preventing HIV.",
      schedule: "Injections every 2 months (CAB-LA) or every 6 months (LEN)",
      process: [
        { time: "Day 1:", detail: "HIV test, and if negative, receive first injection" },
        { time: "After 1 month:", detail: "Second injection (CAB-LA) — then every 2 months" },
        { time: "Every 6 months:", detail: "Lenacapavir — two injections every 6 months after initiation" },
      ],
      note: "Does not protect against STIs or pregnancy.",
    }
  },
];

const QUESTIONS = [
  { id: "pill",      question: "Can you commit to taking a pill every single day?",                        emoji: "💊", options: [{ label: "Yes, I can manage a daily pill", value: true, methods: ["oral"] }, { label: "No, I'd prefer not to", value: false, methods: [] }] },
  { id: "injection", question: "Are you comfortable receiving an injection at a clinic?",                  emoji: "💉", options: [{ label: "Yes, injections are fine", value: true, methods: ["cabla", "len"] }, { label: "No, I prefer to avoid them", value: false, methods: [] }] },
  { id: "vagina",    question: "Are you comfortable inserting something into your vagina?",                emoji: "🔵", options: [{ label: "Yes, I am comfortable with this", value: true, methods: ["ring"] }, { label: "No, I prefer not to", value: false, methods: [] }] },
  { id: "clinics",   question: "How often are you able to visit a clinic?",                               emoji: "🏥", options: [{ label: "Every 2 months", value: "2m", methods: ["cabla"] }, { label: "Every 6 months", value: "6m", methods: ["len"] }, { label: "Every 3 months", value: "3m", methods: ["oral", "ring"] }] },
  { id: "blood",     question: "Are you comfortable with having blood taken?",                            emoji: "🩸", options: [{ label: "Yes, that's fine", value: true, methods: ["oral", "cabla", "len"] }, { label: "No, I'd rather avoid it", value: false, methods: ["ring"] }] },
  { id: "pregnant",  question: "Are you currently pregnant or breastfeeding?",                            emoji: "🤰", options: [{ label: "Yes", value: true, methods: ["oral"] }, { label: "No", value: false, methods: ["oral", "ring", "cabla", "len"] }, { label: "Not sure / Rather not say", value: null, methods: ["oral"] }] },
  { id: "privacy",   question: "Is it important that your HIV prevention method is discreet and private?", emoji: "🔒", options: [{ label: "Yes, privacy is important to me", value: true, methods: ["ring", "cabla", "len"] }, { label: "No, it doesn't matter", value: false, methods: ["oral", "ring", "cabla", "len"] }] },
  { id: "sex",       question: "What type of sex do you have?",                                           emoji: "❤️", options: [{ label: "Vaginal sex only", value: "vaginal", methods: ["oral", "ring", "cabla", "len"] }, { label: "Anal and/or vaginal sex", value: "anal", methods: ["oral", "cabla", "len"] }, { label: "I'd rather not say", value: "other", methods: ["oral", "cabla", "len"] }] },
];

const RESULTS = {
  oral:  { label: "Oral PrEP",        icon: "/img/pills.png",  color: "#3D80E8", description: "Oral PrEP is a daily pill that is very effective at preventing HIV from any kind of exposure. It is widely available at public clinics across South Africa and can be started and stopped easily.", suitable: "Best for people comfortable with a daily routine who want a flexible, well-established option." },
  ring:  { label: "PrEP Ring (DVR)",  icon: "/img/ring.png",   color: "#EBA614", description: "The PrEP ring is a discreet silicone ring worn in the vagina for 28 days. It prevents HIV during vaginal sex and requires no daily action — just a monthly replacement.", suitable: "Best for people who want a discreet, low-maintenance option for vaginal sex." },
  cabla: { label: "CAB-LA Injection", icon: "/img/inject.png", color: "#3D80E8", description: "CAB-LA is an injection given every 2 months that is more than 90% effective. No daily pill needed — just a clinic visit every 2 months.", suitable: "Best for people who prefer not taking a daily pill and can visit a clinic every 2 months." },
  len:   { label: "Lenacapavir (LEN)",icon: "/img/inject.png", color: "#7c3aed", description: "Lenacapavir is a long-acting injection given every 6 months — the least frequent option. It is more than 96% effective at preventing HIV.", suitable: "Best for people who want maximum convenience with minimal clinic visits." },
};

function getResults(answers) {
  const scores = { oral: 0, ring: 0, cabla: 0, len: 0 };
  answers.forEach(({ methods }) => {
    methods.forEach(m => { scores[m] = (scores[m] || 0) + 1; });
  });
  const max = Math.max(...Object.values(scores));
  if (max === 0) return ["oral"];
  return Object.entries(scores).filter(([, v]) => v === max).map(([k]) => k);
}

// ── Method Detail Page ────────────────────────────────────────
function MethodDetailPage({ methodKey, onBack }) {
  const d = METHOD_DETAILS[methodKey];
  const [openFaq, setOpenFaq] = useState(null);
  if (!d) return null;

  return (
    <div style={{ background: bg, minHeight: "100vh", paddingBottom: 100 }}>

      {/* Hero */}
      <div style={{
        background: d.color,
        padding: "120px 20px 40px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <img src="/img/mbackground.png" alt="" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.15,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            width: 90, height: 90, borderRadius: 24,
            background: "rgba(255,255,255,0.2)",
            margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "3px solid rgba(255,255,255,0.4)",
          }}>
            <img src={d.icon} alt={d.label} style={{ width: 52, height: 52, objectFit: "contain" }} />
          </div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: 8 }}>
            {d.label}
          </h1>
          {/* Effectiveness pill */}
          <span style={{
            background: "rgba(255,255,255,0.25)",
            color: "#fff", borderRadius: 99,
            padding: "6px 18px", fontSize: "0.88rem", fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.4)",
          }}>
            ✓ {d.effectiveness}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px" }}>

        {/* What is it + How does it work — side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "22px",
            borderTop: "4px solid " + d.color,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <p style={{ color: d.color, fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
              💡 What is it?
            </p>
            <p style={{ color: "#333", fontSize: "0.9rem", lineHeight: 1.65 }}>{d.what}</p>
          </div>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "22px",
            borderTop: "4px solid " + d.color,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <p style={{ color: d.color, fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
              ⚙️ How does it work?
            </p>
            <p style={{ color: "#333", fontSize: "0.9rem", lineHeight: 1.65 }}>{d.how}</p>
          </div>
        </div>

        {/* How is it used */}
        <div style={{
          background: d.color, borderRadius: 20, padding: "22px",
          marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}>
          <p style={{ color: "rgba(255,255,255,0.8)", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
            📋 How is it used?
          </p>
          <p style={{ color: "#fff", fontSize: "0.95rem", lineHeight: 1.7 }}>{d.used}</p>
        </div>

        {/* Timeline */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "22px",
          marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <p style={{ color: d.color, fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 16 }}>
            🗓 The process
          </p>
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: 20, top: 0, bottom: 0,
              width: 2, background: d.color + "30",
            }} />
            {d.process.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: i < d.process.length - 1 ? 20 : 0, position: "relative" }}>
                {/* Dot */}
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: d.color, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "0.75rem", flexShrink: 0,
                  zIndex: 1, boxShadow: "0 2px 8px " + d.color + "40",
                }}>
                  {i + 1}
                </div>
                <div style={{ paddingTop: 8 }}>
                  <p style={{ color: d.color, fontWeight: 700, fontSize: "0.85rem", marginBottom: 2 }}>{p.time}</p>
                  <p style={{ color: "#444", fontSize: "0.88rem", lineHeight: 1.5 }}>{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side effects */}
        <div style={{
          background: "#fff5f0", border: "2px solid #ffcbb3",
          borderRadius: 20, padding: "22px", marginBottom: 16,
        }}>
          <p style={{ color: "#e05a00", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>
            ⚠️ Side effects
          </p>
          <p style={{ color: "#555", fontSize: "0.9rem", lineHeight: 1.65 }}>{d.sideEffects}</p>
        </div>

        {/* Considerations — grid of pills */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "22px",
          marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <p style={{ color: d.color, fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
            🔍 Things to consider
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.considerations.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 14px", background: d.color + "0d",
                borderRadius: 10, borderLeft: "3px solid " + d.color,
              }}>
                <span style={{ color: d.color, fontWeight: 800, flexShrink: 0 }}>→</span>
                <span style={{ color: "#333", fontSize: "0.9rem", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs — inline expand */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "22px",
          marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <p style={{ color: d.color, fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
            ❓ Frequently asked questions
          </p>
          {d.faqs.map((faq, i) => (
            <div key={i} style={{ marginBottom: i < d.faqs.length - 1 ? 10 : 0 }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  background: openFaq === i ? d.color : d.color + "12",
                  borderRadius: openFaq === i ? "12px 12px 0 0" : 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "all .2s",
                }}
              >
                <span style={{ color: openFaq === i ? "#fff" : d.color, fontWeight: 700, fontSize: "0.9rem" }}>
                  {faq.q}
                </span>
                <img
                  src="/img/arrow.png"
                  alt="toggle"
                  style={{
                    width: 18, height: 18, objectFit: "contain", flexShrink: 0,
                    transform: openFaq === i ? "rotate(270deg)" : "rotate(90deg)",
                    transition: "transform .3s",
                    filter: openFaq === i ? "brightness(0) invert(1)" : "none",
                  }}
                />
              </div>
              {openFaq === i && (
                <div style={{
                  background: d.color + "0d",
                  border: "1px solid " + d.color + "30",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  padding: "14px 18px",
                }}>
                  <p style={{ color: "#333", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          background: "rgba(255,255,255,0.6)", borderRadius: 14,
          padding: "14px 18px", marginBottom: 16,
        }}>
          <p style={{ color: "#555", fontSize: "0.8rem", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
            ⚠️ This information does not replace medical advice. Please speak to a healthcare provider before starting any HIV prevention method.
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(61,128,232,0.15)",
        padding: "16px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        zIndex: 100, flexWrap: "wrap", gap: 10,
      }}>
        <button onClick={onBack} style={{
          background: "transparent", color: blue,
          border: "2px solid " + blue, borderRadius: 99,
          padding: "12px 24px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
        }}>
          ← Back
        </button>
        <Link to="/service-finder"
          style={{ background: d.color, color: "#fff", borderRadius: 99, padding: "12px 24px", fontWeight: 800, fontSize: "0.85rem", letterSpacing: ".04em", textTransform: "uppercase", textDecoration: "none" }}>Find a Clinic</Link>
        <a href="https://wa.me/27781680192" target="_blank" rel="noopener noreferrer"
          style={{ background: "#25d366", color: "#fff", borderRadius: 99, padding: "12px 24px", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          💬 Chat
        </a>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────
function LandingPage({ onStart }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(180deg, #5a9de0 0%, #7ab3ef 100%)", padding: "180px 20px 50px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <img src="/img/mbackground.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: 12 }}>Before taking the quiz, learn about your options:</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 20, lineHeight: 1.2 }}>
            Which PrEP Method<br />is Right for You?
          </h1>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 16 }}>
            {METHOD_INFO.map(m => (
              <div key={m.id} style={{ textAlign: "center" }}>
                <div style={{ width: 70, height: 70, borderRadius: 18, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", border: "2px solid rgba(255,255,255,0.4)" }}>
                  <img src={m.icon} alt={m.label} style={{ width: 40, height: 40, objectFit: "contain" }} />
                </div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.8rem" }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px" }}>
        {METHOD_INFO.map(m => (
          <div key={m.id} style={{ marginBottom: 12 }}>
            <div onClick={() => setOpen(open === m.id ? null : m.id)} style={{ background: open === m.id ? blue : "#fff", border: "2px solid " + blue, borderRadius: open === m.id ? "14px 14px 0 0" : 14, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: open === m.id ? "#fff" : blue, fontWeight: 700, fontSize: "1rem", transition: "all .2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={m.icon} alt={m.label} style={{ width: 32, height: 32, objectFit: "contain", filter: open === m.id ? "brightness(0) invert(1)" : "none" }} />
                <span>{m.content.title}</span>
              </div>
              <img src="/img/arrow.png" alt="Toggle" style={{ width: 20, height: 20, objectFit: "contain", transform: open === m.id ? "rotate(270deg)" : "rotate(90deg)", transition: "transform .3s", filter: open === m.id ? "brightness(0) invert(1)" : "none" }} />
            </div>
            {open === m.id && (
              <div style={{ background: "#fff", border: "2px solid " + blue, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "20px 24px" }}>
                <p style={{ color: blue, fontWeight: 700, marginBottom: 6 }}>{m.content.tagline}</p>
                <p style={{ color: "#555", fontSize: "0.88rem", marginBottom: 12, fontStyle: "italic" }}>{m.content.schedule}</p>
                <p style={{ fontWeight: 700, color: "#333", marginBottom: 8 }}>The process:</p>
                {m.content.process.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, padding: "8px 12px", background: "#f0f6ff", borderRadius: 8 }}>
                    <span style={{ color: blue, fontWeight: 700, minWidth: 100, fontSize: "0.85rem" }}>{p.time}</span>
                    <span style={{ color: "#333", fontSize: "0.85rem" }}>{p.detail}</span>
                  </div>
                ))}
                <p style={{ fontSize: "0.82rem", color: "#666", marginTop: 12, borderLeft: "3px solid " + blue, paddingLeft: 10 }}>{m.content.note}</p>
              </div>
            )}
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 36, paddingBottom: 40 }}>
          <p style={{ color: "#fff", marginBottom: 16, fontSize: "1rem", fontWeight: 600 }}>Ready to find your best match?</p>
          <button onClick={onStart} style={{ background: yellow, color: "#fff", border: "none", borderRadius: 99, padding: "18px 56px", fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 6px 24px rgba(235,166,20,0.45)" }}>
            TAKE THE QUIZ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quiz Page ─────────────────────────────────────────────────
function QuizPage({ onBack, onSubmit }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers, { id: q.id, methods: selected.methods }];
    if (step < QUESTIONS.length - 1) {
      setAnimating(true);
      setTimeout(() => { setAnswers(newAnswers); setStep(s => s + 1); setSelected(null); setAnimating(false); }, 200);
    } else { onSubmit(newAnswers); }
  }

  function handleBack() {
    if (step === 0) { onBack(); }
    else { setStep(s => s - 1); setAnswers(a => a.slice(0, -1)); setSelected(null); }
  }

  return (
    <div style={{ background: bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "rgba(255,255,255,0.3)", position: "sticky", top: 0, zIndex: 50, padding: "90px 20px 12px", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>
            <span>Question {step + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: yellow, width: progress + "%", transition: "width .4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px 120px", opacity: animating ? 0 : 1, transition: "opacity .2s" }}>
        <div style={{ maxWidth: 600, width: "100%" }}>
          <div style={{ textAlign: "center", fontSize: "3.5rem", marginBottom: 20 }}>{q.emoji}</div>
          <h2 style={{ textAlign: "center", color: "#fff", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, marginBottom: 28, lineHeight: 1.35 }}>{q.question}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === opt;
              return (
                <div key={i} onClick={() => setSelected(opt)} style={{ background: isSelected ? blue : "#fff", border: "2px solid " + (isSelected ? blue : "rgba(255,255,255,0.8)"), borderRadius: 16, padding: "18px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .2s", boxShadow: isSelected ? "0 4px 20px rgba(61,128,232,0.35)" : "0 2px 8px rgba(0,0,0,0.08)", transform: isSelected ? "scale(1.02)" : "scale(1)" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid " + (isSelected ? "#fff" : blue), background: isSelected ? "#fff" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isSelected && <div style={{ width: 14, height: 14, borderRadius: "50%", background: blue }} />}
                  </div>
                  <span style={{ color: isSelected ? "#fff" : "#333", fontWeight: 600, fontSize: "1rem", lineHeight: 1.3 }}>{opt.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(61,128,232,0.15)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
        <button onClick={handleBack} style={{ background: "transparent", color: blue, border: "2px solid " + blue, borderRadius: 99, padding: "12px 28px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>← Back</button>
        <button onClick={handleNext} disabled={!selected} style={{ background: selected ? yellow : "rgba(235,166,20,0.3)", color: "#fff", border: "none", borderRadius: 99, padding: "12px 36px", fontWeight: 800, fontSize: "0.95rem", letterSpacing: ".04em", textTransform: "uppercase", cursor: selected ? "pointer" : "not-allowed", transition: "all .2s", boxShadow: selected ? "0 4px 16px rgba(235,166,20,0.4)" : "none" }}>
          {step === QUESTIONS.length - 1 ? "See Results →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

// ── Results Page ──────────────────────────────────────────────
function ResultsPage({ answers, onBack, onRetake, onViewDetail }) {
  const results = getResults(answers);
  return (
    <div style={{ background: bg, minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(180deg, #5a9de0 0%, #7ab3ef 100%)", padding: "120px 20px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <img src="/img/mbackground.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, color: "#fff", marginBottom: 8 }}>Your Results</h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1rem" }}>
            {results.length === 1 ? "Based on your answers, this method may work best for you:" : "Based on your answers, these methods may work for you:"}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 140px" }}>
        {results.map((r, idx) => {
          const res = RESULTS[r];
          if (!res) return null;
          return (
            <div key={r} style={{ background: "#fff", border: "3px solid " + res.color, borderRadius: 20, padding: "28px", marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: res.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={res.icon} alt={res.label} style={{ width: 36, height: 36, objectFit: "contain" }} />
                </div>
                <div>
                  {idx === 0 && results.length > 1 && (
                    <span style={{ background: yellow, color: "#fff", fontSize: "0.7rem", fontWeight: 800, padding: "2px 8px", borderRadius: 99, letterSpacing: ".06em", textTransform: "uppercase", display: "inline-block", marginBottom: 4 }}>Top Match</span>
                  )}
                  <h3 style={{ color: res.color, fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>{res.label}</h3>
                </div>
              </div>
              <p style={{ color: "#333", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 12 }}>{res.description}</p>
              <div style={{ background: res.color + "12", borderLeft: "4px solid " + res.color, borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ color: res.color, fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>{res.suitable}</p>
              </div>
              {/* Learn more button */}
              <button
                onClick={() => onViewDetail(r)}
                style={{
                  background: res.color, color: "#fff", border: "none",
                  borderRadius: 99, padding: "10px 24px",
                  fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
                  letterSpacing: ".04em", textTransform: "uppercase",
                }}
              >
                Learn More →
              </button>
            </div>
          );
        })}

        <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: "16px 20px", marginTop: 8, marginBottom: 20 }}>
          <p style={{ color: "#555", fontSize: "0.82rem", lineHeight: 1.6, margin: 0, textAlign: "center" }}>
            ⚠️ This quiz is for information only and does not replace medical advice. Please speak to a healthcare provider before starting any HIV prevention method.
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={onRetake} style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.7)", borderRadius: 99, padding: "10px 28px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            Retake Quiz
          </button>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(61,128,232,0.15)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100, flexWrap: "wrap", gap: 10 }}>
        <button onClick={onBack} style={{ background: "transparent", color: blue, border: "2px solid " + blue, borderRadius: 99, padding: "12px 24px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>← Back</button>
        <Link to="/service-finder" style={{ background: blue, color: "#fff", borderRadius: 99, padding: "12px 24px", fontWeight: 800, fontSize: "0.85rem", letterSpacing: ".04em", textTransform: "uppercase", textDecoration: "none" }}>Find a Clinic</Link>
        <a href="https://wa.me/27781680192" target="_blank" rel="noopener noreferrer" style={{ background: "#25d366", color: "#fff", borderRadius: 99, padding: "12px 24px", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>💬 Chat</a>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function Quiz() {
  const [step,      setStep]      = useState("landing");
  const [answers,   setAnswers]   = useState([]);
  const [detailKey, setDetailKey] = useState(null);

  function handleSubmit(ans) { setAnswers(ans); setStep("results"); }
  function handleViewDetail(key) { setDetailKey(key); setStep("detail"); }

  return (
    <>
      <Navbar />
      {step === "landing" && <LandingPage onStart={() => setStep("quiz")} />}
      {step === "quiz"    && <QuizPage onBack={() => setStep("landing")} onSubmit={handleSubmit} />}
      {step === "results" && <ResultsPage answers={answers} onBack={() => setStep("quiz")} onRetake={() => { setAnswers([]); setStep("landing"); }} onViewDetail={handleViewDetail} />}
      {step === "detail"  && <MethodDetailPage methodKey={detailKey} onBack={() => setStep("results")} />}
    </>
  );
}