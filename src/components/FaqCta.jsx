import { Link } from "react-router-dom";
export default function FaqCta() {
  return (
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
  );
}
