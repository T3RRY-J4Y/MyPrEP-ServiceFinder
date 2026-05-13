import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FAQ_METHODS } from "../data/faqs";

export default function Faqs() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openFaq, setOpenFaq]           = useState(null);
  const positionIndex = useRef(FAQ_METHODS.length);
  const trackRef      = useRef(null);

  const total = FAQ_METHODS.length;

  // Build triple-looped cards array (same as original)
  const tripleCards = [];
  for (let i = 0; i < total * 3; i++) {
    tripleCards.push(FAQ_METHODS[i % total]);
  }

  function updateCarousel(skipAnimation = false) {
    const track     = trackRef.current;
    const container = track?.parentElement;
    if (!track || !container) return;

    const card      = track.querySelector(".method-card");
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap       = parseFloat(getComputedStyle(track).gap) || 0;
    const offset    = (container.offsetWidth / 2) - (cardWidth / 2) - (positionIndex.current * (cardWidth + gap));

    track.style.transition = skipAnimation
      ? "none"
      : "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform  = `translateX(${offset}px)`;

    // Update active card
    track.querySelectorAll(".method-card").forEach((c, i) => {
      c.classList.toggle("active", i === positionIndex.current);
    });
  }

  function handleLoop() {
    if (positionIndex.current >= total * 2) {
      positionIndex.current -= total;
      requestAnimationFrame(() => updateCarousel(true));
    } else if (positionIndex.current < total) {
      positionIndex.current += total;
      requestAnimationFrame(() => updateCarousel(true));
    }
  }

  function goNext() {
    positionIndex.current++;
    const next = (currentIndex + 1) % total;
    setCurrentIndex(next);
    setOpenFaq(null);
    updateCarousel();
    handleLoop();
  }

  function goPrev() {
    positionIndex.current--;
    const prev = (currentIndex - 1 + total) % total;
    setCurrentIndex(prev);
    setOpenFaq(null);
    updateCarousel();
    handleLoop();
  }

  function goTo(index, tripleIndex) {
    positionIndex.current = tripleIndex;
    setCurrentIndex(index);
    setOpenFaq(null);
    updateCarousel();
  }

  // Initial setup + resize
  useEffect(() => {
    updateCarousel(true);
    const onResize = () => updateCarousel(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Re-run carousel update whenever currentIndex changes
  useEffect(() => {
    updateCarousel();
  }, [currentIndex]);

  const method = FAQ_METHODS[currentIndex];

  return (
    <>
      <Navbar />

      <body className="faqs-page">
        <header>
          <div className="cloud cloud1">
            <img src="/img/cloud1.png" alt="" />
          </div>
        </header>

        <section className="faqs-section">
          <div className="faq-wrapper">
            <h1>Frequently Asked Questions</h1>

            {/* Carousel */}
            <div className="carousel">
              <button
                className="arrow"
                id="prev"
                onClick={goPrev}
                aria-label="Previous"
              >
                <img
                  src="/img/arrow.png"
                  alt="Previous"
                  style={{ transform: "rotate(180deg)" }}
                />
              </button>

              <div className="cards-container">
                <div className="cards-track" ref={trackRef}>
                  {tripleCards.map((m, i) => (
                    <div
                      key={i}
                      className="method-card"
                      onClick={() => goTo(i % total, i)}
                    >
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="arrow"
                id="next"
                onClick={goNext}
                aria-label="Next"
              >
                <img src="/img/arrow.png" alt="Next" />
              </button>
            </div>

            {/* FAQ Accordion */}
            <div className="questions-container" id="faqContainer">
              {method.faqs.map((faq, i) => (
                <div key={i} className="question">
                  <button
                    className="faq-btn"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="faq-text">{faq.q}</span>
                    <img
                      src="/img/arrow.png"
                      className={`faq-arrow${openFaq === i ? " rotate" : ""}`}
                      alt="Toggle"
                    />
                  </button>
                  {openFaq === i && (
                    <p dangerouslySetInnerHTML={{ __html: faq.a }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </body>
    </>
  );
}