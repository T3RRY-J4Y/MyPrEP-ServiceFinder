import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home",             to: "/" },
  { label: "Methods",          to: "/methods" },
  { label: "PrEP vs PEP vs ART", to: "/pvpva" },
  { label: "PrEP Quiz",        to: "https://prepmethodquiz.web.app/#/",              external: true },
  { label: "Service Finder",   to: "https://witsrhi-servicefinder-client.onrender.com/", external: true },
  { label: "Resources",        to: "/resources" },
  { label: "Training",         to: "/training" },
  { label: "FAQs",             to: "/faqs" },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <div className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src="/img/logo.png" alt="MyPrEP Logo" />
          </Link>
        </div>

        <ul className={`menu${menuOpen ? " active" : ""}`} id="nav-links">
          {NAV_ITEMS.map(({ label, to, external }) =>
            external ? (
              <li key={label}>
                <a href={to} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                  {label}
                </a>
              </li>
            ) : (
              <li key={label}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                  onClick={closeMenu}
                >
                  {label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        <div
          className={`hamburger${menuOpen ? " open" : ""}`}
          id="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          role="button"
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </div>
      </div>
    </header>
  );
}
