import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CloudLayer from "../components/CloudLayer";
import Footer from "../components/Footer";

const SLIDES = [
  {
    id: "prep",
    label: "Oral PrEP",
    thumb: "/img/pills.png",
    bg: "/img/newBackground.png",
    heading: "Oral PrEP",
    body: "Oral PrEP is a pill containing antiretroviral (ARV) medication that you can take if you are HIV-negative to prevent HIV.",
  },
  {
    id: "inject",
    label: "Injectable PrEP",
    thumb: "/img/inject.png",
    bg: "/img/newBackground.png",
    heading: "Lenacapavir",
    body: "Two injections given every 6 months to prevent getting HIV from any kind of exposure. Ask your healthcare provider if this method is available at your clinic.",
  },
  {
    id: "condom",
    label: "Condoms",
    thumb: "/img/condom.png",
    bg: "/img/newBackground.png",
    heading: "Condoms",
    body: "Condoms are a barrier method you can use during sex to prevent getting HIV, other STIs, and unintended pregnancy.",
  },
  {
    id: "ring",
    label: "PrEP Ring",
    thumb: "/img/ring.png",
    bg: "/img/newBackground.png",
    heading: "Dapivirine Ring (PrEP Ring)",
    body: "A flexible silicone ring worn in the vagina and replaced every 28 days to prevent getting HIV during receptive vaginal sex.",
  },
  {
    id: "cab",
    label: "CAB-LA",
    thumb: "/img/cab.png",
    bg: "/img/newBackground.png",
    heading: "Long-acting cabotegravir (CAB-LA)",
    body: "An injection received every two months to prevent getting HIV from any kind of exposure. Ask your healthcare provider if this method is available at your clinic.",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const touchStart = useRef(0);

  function go(idx) {
    setActive((idx + SLIDES.length) % SLIDES.length);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActive((a) => (a + 1) % SLIDES.length),
      5000
    );
  }

  useEffect(() => {
    timerRef.current = setInterval(
      () => setActive((a) => (a + 1) % SLIDES.length),
      5000
    );
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const selectors = [
      ".info-section",
      ".split-section",
      ".section-divider",
      ".icon-cards-section",
      ".features-section",
      ".features-cta",
      ".faq-cta",
    ];
    const observers = [];
    selectors.forEach((sel) => {
      const els = document.querySelectorAll(sel);
      const obs = new IntersectionObserver(
        (entries, o) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              o.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      els.forEach((el) => obs.observe(el));
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <Navbar />

      {/* SLIDER */}
      <div className="slider">
        <div className="hero-image">
  <img src="/img/newBackground.png" alt="City Background" />
</div>

<CloudLayer count={3} />

<div className="bird-container"><div className="bird" /></div>
<div className="bird-container2"><div className="bird2" /></div>

        <div
          className="list"
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) go(active + (diff > 0 ? 1 : -1));
          }}
        >
          {SLIDES.map((slide, i) => (
            <div key={slide.id} className={`item${i === active ? " active" : ""}`}>
              <div className="content">
                <p>{slide.heading}</p>
                <p>{slide.body}</p>
                <Link to="/methods" className="learn-more-btn" style={{ marginTop: "20px", display: "inline-block" }}>Learn More</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="thumbnail">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`item${i === active ? " active" : ""}`}
              onClick={() => go(i)}
            >
              <img src={slide.thumb} alt={slide.label} />
              <div className="content">{slide.label}</div>
            </div>
          ))}
        </div>

        <div className="arrows">
          <button id="prev" onClick={() => go(active - 1)}>{""}</button>
          <button id="next" onClick={() => go(active + 1)}>{""}</button>
        </div>
      </div>

      <div className="site-wrapper">

        {/* INFO SECTION */}
        <section className="info-section">
          <div className="info-image">
            <img src="/img/woman.png" alt="Info Image" />
          </div>
          <div className="info-content">
            <h2 className="info-title">Is PrEP right for me?</h2>
            <p className="info-text">
              The MyPrEP Quiz is a quick and confidential way to explore your HIV prevention options.
              Answer a few simple questions and get guidance on whether PrEP could work for you,
              plus links to trusted services and support.
            </p>
            <button
              className="info-btn"
              onClick={() => window.open("https://prepmethodquiz.web.app/#/", "_blank")}
            >
              Learn More
            </button>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="section-divider" />

        {/* SPLIT SECTION */}
        <section className="split-section">
          <div className="left-column">
            <h2 className="side-title">What's the difference</h2>
            <p className="side-text">
              What's the difference between PrEP, PEP and ART? All three use antiretrovirals
              in different combinations for different purposes.
            </p>
            <Link to="/pvpva">
              <button className="side-btn">Learn More</button>
            </Link>
          </div>
          <div className="right-column">
            <div className="icon-grid">
              {[
                { img: "/img/prep.png", label: "PrEP", tip: "PrEP is when ARVs are taken before exposure to HIV, to prevent getting HIV." },
                { img: "/img/pep.png",  label: "PEP",  tip: "PEP is when ARVs are taken after exposure to HIV, to prevent HIV (within 72 hours and taken for 28 days only)." },
                { img: "/img/art.png",  label: "ART",  tip: "ART is when ARVs are used to treat a person living with HIV, and is taken lifelong." },
              ].map(({ img, label, tip }) => (
                <div key={label} className="icon-item">
                  <img src={img} alt={label} />
                  <span className="icon-title">{label}</span>
                  <div className="popup-balloon">{tip}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHERE CAN I FIND IT */}
        <section className="icon-cards-section">
          <div className="container">
            <h2 className="section-title">Where can I find it?</h2>
            <p className="section-text">
              Looking for PrEP, HIV testing, or other sexual and reproductive health services?
              Services are run by trained healthcare providers.
            </p>
            <div className="icon-cards">
              {[
                { img: "/img/shield.png", label: "Sexual and reproductive health services" },
                { img: "/img/clinic.png", label: "Healthcare Facilities" },
                { img: "/img/float.png",  label: "Support" },
              ].map(({ img, label }) => (
                <div key={label} className="icon-card">
                  <div className="icon-circle">
                    <img src={img} alt={label} />
                  </div>
                  <p className="icon-title">{label}</p>
                </div>
              ))}
            </div>
            <div className="service-finder-cta">
  <a
    href="https://witsrhi-servicefinder-client.onrender.com/"
    className="service-finder-btn"
    target="_blank"
    rel="noopener noreferrer"
  >
    Find a Service Near You
  </a>
</div>
          </div>
        </section>

        {/* RESOURCES SECTION */}
        <section className="features-section">
          <div className="features-container">
            <div className="features-header">
              <h2 className="features-title">Resources</h2>
              <p className="features-intro">
                Explore a full collection of implementation guidelines, job aids, IEC materials
                and other resources and tools that support the delivery of HIV prevention and SRH services.
              </p>
            </div>
            <div className="features-grid">
              {[
                { href: "/resources#policy",    img: "/img/policy.png",    title: "Implementation Guidelines", text: "Official guidance that informs HIV prevention and sexual and reproductive health services." },
                { href: "/resources#job-aids",  img: "/img/jobaids.png",   title: "Job Aids",                  text: "Practical tools that support healthcare providers and implementers in delivering services." },
                { href: "/resources#iec",       img: "/img/iec.png",       title: "IEC Materials",             text: "Clear, user-friendly information to support awareness, understanding, and informed decision-making." },
                { href: "/resources#community", img: "/img/community.png", title: "Community Engagement",      text: "Resources that support dialogue, outreach, and community-led HIV prevention activities." },
              ].map(({ href, img, title, text }) => (
                <Link key={title} to={href} className="feature-link">
                  <div className="feature-card">
                    <img src={img} alt={title} />
                    <div className="feature-card-content">
                      <h4 className="feature-card-title">{title}</h4>
                      <p className="feature-card-text">{text}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* TRAINING CTA */}
          <div className="features-cta">
            <h3 className="features-cta-title">Training</h3>
            <p className="features-cta-text">
              This training builds knowledge on HIV prevention options, including Oral PrEP, CAB-LA,
              the PrEP ring, LEN, and PEP, and supports HIV prevention ambassadors with
              community-based activities and knowledge building.
            </p>
            <div className="features-buttons">
              <Link to="/training" className="features-link">
                <button className="features-btn">Learn More</button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="faq-cta">
          <div className="faq-cta-inner">
            <div className="faq-cta-text">
              <h2 className="faq-cta-title">FAQs</h2>
              <p className="faq-cta-intro">
                Clear, straightforward answers to common questions about HIV prevention options,
                services, and support, designed to help you understand your choices and know what to do next.
              </p>
            </div>
            <div className="faq-cta-action">
              <Link to="/faqs" className="faq-cta-button">Learn More</Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}