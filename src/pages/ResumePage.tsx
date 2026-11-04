import { Helmet } from "react-helmet-async";
import PageShell from "../components/PageShell";
import ElectronicsSticker from "../components/ElectronicsSticker";
import { site } from "../content/site";

export default function ResumePage() {
  const resume = site.resume;

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <Helmet>
        <title>Resume | Yash Gulati</title>
        <meta name="description" content={`Resume for ${site.identity.name}`} />
        <link rel="canonical" href="https://yashgulati.tech/resume" />
      </Helmet>
      <PageShell activeRoute="resume">
        <section className="notebook-section">
          <div className="section-heading">
            <h2>Resume</h2>
            <ElectronicsSticker
              kind="uart"
              note={site.stickers.find((s) => s.kind === "uart")?.note ?? ""}
            />
          </div>

          <div className="resume-controls no-print" style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {site.contact.resumePdf && (
              <a
                href={site.contact.resumePdf}
                download
                className="resume-button"
                style={{
                  minHeight: '44px',
                  padding: '0 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #6b6b6b',
                  background: '#f3efe3',
                  font: '14px/1.4 var(--mono)',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                Download PDF
              </a>
            )}
          </div>

          <div className="resume-sheet">
            <header className="resume-header">
              <h1>{resume.name}</h1>
              <p>{resume.location}</p>
              <div className="resume-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px' }}>
                {site.contact.email && <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>}
                {site.contact.linkedin && <a href={site.contact.linkedin}>LinkedIn</a>}
                {site.contact.github && <a href={site.contact.github}>GitHub</a>}
                {site.contact.blog && <a href={site.contact.blog}>Tech blog</a>}
                {site.contact.labSite && <a href={site.contact.labSite}>Lab site</a>}
                {site.contact.labBlog && <a href={site.contact.labBlog}>Lab blog</a>}
                <a href="https://yashgulati.tech">yashgulati.tech</a>
              </div>
            </header>

            <section className="resume-section">
              <h2>Summary</h2>
              <p>{resume.summary}</p>
            </section>

            <section className="resume-section">
              <h2>Skills</h2>
              {site.skillGroups.map((group) => (
                <p key={group.name}>
                  <strong>{group.name}:</strong> {group.items.join(", ")}
                </p>
              ))}
            </section>

            <section className="resume-section">
              <h2>Projects</h2>
              {resume.projects.map((project) => (
                <article className="resume-project" key={project.title}>
                  <h3>
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                    {"meta" in project && project.meta && (
                      <span className="project-meta"> ({project.meta})</span>
                    )}
                  </h3>
                  <p className="project-stack">{project.stack}</p>
                  <ul>
                    {project.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>

            <section className="resume-section">
              <h2>Experience</h2>
              <article>
                <h3>
                  {site.internship.title}, {site.internship.org}
                </h3>
                <p className="experience-meta">
                  {site.internship.program}, {site.internship.dates}
                </p>
                <ul>
                  {site.internship.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="resume-section">
              <h2>Training</h2>
              <article>
                <h3>{resume.training.title}</h3>
                <p className="experience-meta">{resume.training.dates}</p>
                <ul>
                  {resume.training.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="resume-section">
              <h2>Education</h2>
              {site.education.map((item) => (
                <article key={item.degree}>
                  <h3>
                    {item.degree}, {item.school}
                  </h3>
                  <p>{item.years}</p>
                  {item.coursework && item.coursework.length > 0 && (
                    <p>
                      <strong>Relevant coursework:</strong> {item.coursework.join(", ")}
                    </p>
                  )}
                </article>
              ))}
            </section>

            <section className="resume-section">
              <h2>Certifications</h2>
              <ul>
                {site.certifications.map((cert) => (
                  <li key={cert.name}>
                    <strong>{cert.name}</strong>, {cert.issuer}, {cert.year}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </section>
      </PageShell>
    </>
  );
}
