import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <section className="pvpva-section">
        <div className="header-image-container pvpva-header-overlay">
          <img
            src="/img/mbackground.png"
            alt="Privacy Policy"
            className="header-image"
            style={{ width: "100%", maxHeight: 300, objectFit: "cover" }}
          />
          <div className="pvpva-header-text">
            <h1 className="pvpva-title">Privacy Policy</h1>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px 60px" }}>
          <iframe
            src="/pdfs/PrivacyPolicy.pdf"
            title="Privacy Policy"
            style={{
              width: "100%",
              height: "80vh",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}