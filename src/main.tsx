import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import type { ComponentType } from "react";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "@fontsource/caveat/latin-500.css";
import "./styles.css";
import App from "./App";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ResumePage from "./pages/ResumePage";
import NotFoundPage from "./pages/NotFoundPage";
import routes from "./content/routes.json";

const routePages: Record<string, ComponentType> = {
  home: App,
  about: AboutPage,
  projects: ProjectsPage,
  resume: ResumePage,
};

function ScrollToTop() {
  const location = useLocation();

  React.useEffect(() => {
    // Only scroll to top on route change, not hash change
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

function HashRedirect() {
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#about") {
      window.location.replace("/about");
    } else if (hash === "#work") {
      window.location.replace("/projects");
    }
  }, []);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <HashRedirect />
        <Routes>
          {routes.map(({ path, page }) => {
            const Page = routePages[page];
            if (!Page) throw new Error(`No page component registered for route: ${path}`);
            return <Route key={path} path={path} element={<Page />} />;
          })}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
