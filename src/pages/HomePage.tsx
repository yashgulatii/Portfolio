import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import ElectronicsSticker from "../components/ElectronicsSticker";
import MarginArrow from "../components/MarginArrow";
import LabDiagram from "../components/LabDiagram";
import Certifications from "../components/Certifications";
import { site } from "../content/site";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>{site.identity.name}</title>
        <meta name="description" content={site.content.labels.pageDescription} />
        <link rel="canonical" href={site.content.labels.canonical} />
      </Helmet>
      <PageShell activeRoute="home">
        <section className="notebook-section">
          <div className="section-heading">
            <h2>{site.content.labels.about}</h2>
            <ElectronicsSticker
              kind="resistor"
              note={site.stickers.find((s) => s.kind === "resistor")?.note ?? ""}
            />
          </div>
          {site.about.story && site.about.story.length > 0 && (
            <p className="section-intro">{site.about.story[0]}</p>
          )}
          <div className="about-grid">
            {site.education[0] && (
              <div className="paper-card">
                <h3>{site.content.labels.aboutEducation}</h3>
                <p>{site.education[0].degree}, {site.education[0].school}</p>
                <p>{site.education[0].years}</p>
              </div>
            )}
            {site.internship && (
              <div className="paper-card">
                <h3>{site.content.labels.internshipLabel}</h3>
                <p>{site.internship.title}, {site.internship.org}</p>
                <p>{site.internship.program}, {site.internship.dates}</p>
              </div>
            )}
            {site.certifications.length > 0 && (
              <div className="paper-card">
                <h3>{site.content.labels.certHeading}</h3>
                {site.certifications.map((cert) => (
                  <p key={cert.name}>{cert.name}, {cert.issuer}, {cert.year}</p>
                ))}
                <div className="margin-note-wrap">
                  <MarginArrow />
                  <span className="margin-note handwriting">{site.nextCerts}</span>
                </div>
              </div>
            )}
          </div>
          <Link to="/about" className="about-button">
            {site.content.labels.navAbout}
          </Link>
        </section>

        <section className="notebook-section">
          <div className="section-heading">
            <h2>{site.content.labels.lab}</h2>
            <ElectronicsSticker
              kind="esp32"
              note={site.stickers.find((s) => s.kind === "esp32")?.note ?? ""}
            />
          </div>
          <LabDiagram />
        </section>

        <section className="notebook-section">
          <div className="section-heading">
            <h2>{site.content.labels.certHeading}</h2>
            <ElectronicsSticker
              kind="timer"
              note={site.stickers.find((s) => s.kind === "timer")?.note ?? ""}
            />
          </div>
          <Certifications />
        </section>
      </PageShell>
    </>
  );
};

export default HomePage;