import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
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
    label: "Lenacapavir",
    thumb: "/img/inject.png",
    bg: "/img/newBackground.png",
    heading: "Lenacapavir",
    body: "Two injections given every 6 months to prevent getting HIV from any kind of exposure.",
  },
  {
    id: "condom",
    label: "Condom",
    thumb: "/img/condom.png",
    bg: "/img/newBackground.png",
    heading: "Condom",
    body: "Condoms are a thin barrier used during sex to help prevent HIV and other STIs. They can also help prevent pregnancy.",
  },
  {
    id: "ring",
    label: "PrEP Ring (DVR)",
    thumb: "/img/ring.png",
    bg: "/img/newBackground.png",
    heading: "PrEP Ring (DVR)",
    body: "The Ring is made of flexible silicone and contains ARV medication used for HIV prevention. Inserted into the vagina for 28 days.",
  },
  {
    id: "cab",
    label: "CAB-LA",
    thumb: "/img/cab.png",
    bg: "/img/newBackground.png",
    heading: "CAB-LA",
    body: "CAB-LA is a PrEP injection containing antiretroviral medication taken by HIV-negative people to prevent getting HIV.",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  function go(idx) {
    setActive((idx + SLIDES.length) % SLIDES.length);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 5000);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Swipe
  const touchStart = useRef(0);

  return (
    <>
      <Navbar />
      <div className="slider">
        {SLIDES.map((slide, i) => (
          <div key={slide.id} className={`list item${i === active ? " active" : ""}`}
               onTouchStart={e => { touchStart.current = e.touches[0].clientX; }}
               onTouchEnd={e => {
                 const diff = touchStart.current - e.changedTouches[0].clientX;
                 if (Math.abs(diff) > 50) go(active + (diff > 0 ? 1 : -1));
               }}
          >
            <div className="hero-image">
              <img src={slide.bg} alt="" />
            </div>
            <div className="content">
              <p>{slide.heading}</p>
              <p>{slide.body}</p>
              <Link to="/methods" className="learn-more-btn">Learn More</Link>
            </div>
          </div>
        ))}

        <div className="thumbnail">
          {SLIDES.map((slide, i) => (
            <div key={slide.id} className={`item${i === active ? " active" : ""}`} onClick={() => go(i)}>
              <img src={slide.thumb} alt={slide.label} />
              <div className="content"><p>{slide.label}</p></div>
            </div>
          ))}
        </div>

        <div className="arrows">
          <button id="prev" onClick={() => go(active - 1)}>{"<"}</button>
          <button id="next" onClick={() => go(active + 1)}>{">"}</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
