import { Link } from "react-router-dom";
import { site } from "../content/site";

type FooterProps = {
  onOpenSerial: () => void;
};

export default function Footer({ onOpenSerial }: FooterProps) {
  const labels = site.content.labels;
  const footerLinks = site.content.nav.filter((item) =>
    ["About", "Projects", "Resume", "Contact"].includes(item.label),
  );

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((item) => {
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
              <Link to={item.href} key={item.label}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="footer-center">{labels.footer}</p>
        <button
          className="footer-serial-btn"
          type="button"
          onClick={onOpenSerial}
        >
          {labels.openSerial}
        </button>
      </div>
    </footer>
  );
}
