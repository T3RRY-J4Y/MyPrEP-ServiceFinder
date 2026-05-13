import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FAQ_METHODS } from "../data/faqs";

export default function Faqs() {
  const [current, setCurrent] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const trackRef = useRef(null);

  function go(i) {
    setCurrent((i + FAQ_METHODS.length) % FAQ_METHODS.length);
    setOpenFaq(null);
  }

  const method = FAQ_METHODS[current];

  return (
    <>
      <Navbar />
      <section className="faqs-section">
        <div className="faq-wrapper">
          <h1>Frequently Asked Questions</h1>
          <div className="carousel">
            <button className="arrow" id="prev" onClick={() => go(current - 1)} aria-label="Previous">
              <img src="/img/arrow.png" alt="Previous" style={{ transform: "rotate(180deg)" }} />
            </button>
            <div className="cards-container">
              <div className="cards-track" ref={trackRef} style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                {FAQ_METHODS.map((m, i) => (
                  <div
                    key={m.name}
                    className={`method-card${i === current ? " active" : ""}`}
                    onClick={() => go(i)}
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
            <button className="arrow" id="next" onClick={() => go(current + 1)} aria-label="Next">
              <img src="/img/arrow.png" alt="Next" />
            </button>
          </div>

          <div className="questions-container" id="faqContainer">
            {method.faqs.map((faq, i) => (
              <div key={i} className="question">
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="faq-text">{faq.q}</span>
                  <img src="/img/arrow.png" className={`faq-arrow${openFaq === i ? " rotate" : ""}`} alt="Toggle" />
                </button>
                {openFaq === i && <p dangerouslySetInnerHTML={{ __html: faq.a }} />}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
