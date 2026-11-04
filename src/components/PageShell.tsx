import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { site } from "../content/site";
import Header from "./Header";
import Footer from "./Footer";
import SerialMonitor from "./SerialMonitor";

type Props = {
  children: ReactNode;
  activeRoute?: "about" | "projects" | "resume" | null;
  activeSection?: string | null;
  showLogNavigation?: boolean;
  beforeMain?: ReactNode;
};

export default function PageShell({
  children,
  activeRoute,
  activeSection,
  showLogNavigation = false,
  beforeMain,
}: Props) {
  const [serialOpen, setSerialOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleOpen = () => setSerialOpen(true);
    window.addEventListener("open-serial", handleOpen);
    return () => window.removeEventListener("open-serial", handleOpen);
  }, []);

  const nav = site.content.nav.filter((item) => {
    if ("conditional" in item && item.conditional === "log") return showLogNavigation;
    return true;
  });

  const isActive = (item: (typeof nav)[number]) => {
    if (location.pathname === "/") {
      if (item.href === "/#about") return activeSection === "about";
      if (item.href === "/#projects") return activeSection === "work";
      if (item.href === "/#lab") return activeSection === "lab";
      if (item.href === "/#contact") return activeSection === "contact";
      if ("conditional" in item && item.conditional === "log" && item.href === "/#log") return activeSection === "log";
      return false;
    }
    return location.pathname === item.href;
  };

  const currentSection = activeSection || activeRoute;

  return (
    <div className="page-shell">
      <Header activeSection={currentSection} showLogNavigation={showLogNavigation} />

      <nav className="index-tabs" aria-label="Index tabs">
        {nav.map((item) => {
          const active = isActive(item);
          const tabClass = `index-tab index-tab--${item.color}${active ? " is-active" : ""}`;
          if ("external" in item && item.external) {
            return (
              <a
                className={tabClass}
                href={item.href}
                key={item.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{item.label}</span>
              </a>
            );
          }
          return (
            <Link
              className={tabClass}
              to={item.href}
              key={item.label}
              aria-current={active ? "page" : undefined}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {beforeMain}

      <main className="page-main notebook">{children}</main>

      <Footer onOpenSerial={() => setSerialOpen(true)} />

      {serialOpen && (
        <SerialMonitor onClose={() => setSerialOpen(false)} />
      )}
    </div>
  );
}
