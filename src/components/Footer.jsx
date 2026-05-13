export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-partners">
            <a href="#"><img src="/img/partner1.png" alt="Partner 1" /></a>
            <a href="https://bwisehealth.com/" target="_blank" rel="noopener noreferrer">
              <img src="/img/partner2.png" alt="Partner 2" />
            </a>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/IChooseMeSA" target="_blank" rel="noopener noreferrer">
              <i className="ri-facebook-fill" />
            </a>
            <a href="https://x.com/IChooseMe_SA" target="_blank" rel="noopener noreferrer">
              <i className="ri-twitter-fill" />
            </a>
            <a href="https://www.instagram.com/ichooseme_sa/?hl=en" target="_blank" rel="noopener noreferrer">
              <i className="ri-instagram-fill" />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MyPrEP. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
