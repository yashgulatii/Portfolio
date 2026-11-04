import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { site } from "../content/site";

type HeaderProps = {
  activeSection?: string | null;
};

export default function Header({ activeSection }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const labels = site.content.labels;

  const nav = site.content.nav.filter((item) => {
    if ("conditional" in item && item.conditional === "log") return false; // Log renders conditionally
    return true;
  });

  const isActive = (item: (typeof nav)[number]) => {
    if (location.pathname === "/") {
      if (item.href === "/#lab") return activeSection === "lab";
      if (item.href === "/#contact") return activeSection === "contact";
      if ("conditional" in item && item.conditional === "log" && item.href === "/#log") return activeSection === "log";
      return false;
    }
    return location.pathname === item.href;
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">
          {site.identity.name}
        </Link>

        <nav className="header-nav" aria-label="Primary">
          {nav.map((item) => {
            const active = isActive(item);
            if ("highlight" in item && item.highlight) {
              return (
                <Link
                  to={item.href}
                  className={`header-resume-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  key={item.label}
                >
                  {item.label}
                </Link>
              );
            }
            if ("external" in item && item.external) {
              return (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={item.label}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                to={item.href}
                className={active ? "is-active" : ""}
                aria-current={active ? "page" : undefined}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-label={labels.navMenu}
        >
          {labels.navMenu}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h2>{site.identity.name}</h2>
              <button type="button" className="menu-close" onClick={closeMenu} aria-label={labels.navClose}>
                {labels.navClose} ×
              </button>
            </div>
            <nav className="mobile-menu-nav">
              {nav.map((item) => {
                const active = isActive(item);
                if ("highlight" in item && item.highlight) {
                  return (
                    <Link
                      to={item.href}
                      className={`mobile-menu-resume${active ? " is-active" : ""}`}
                      onClick={closeMenu}
                      key={item.label}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                }
                if ("external" in item && item.external) {
                  return (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      key={item.label}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    to={item.href}
                    onClick={closeMenu}
                    key={item.label}
                    className={active ? "is-active" : ""}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
