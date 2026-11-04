import { Helmet } from "react-helmet-async";
import PageShell from "../components/PageShell";
import ElectronicsSticker from "../components/ElectronicsSticker";
import ToolNote from "../components/ToolNote";
import { site } from "../content/site";

export default function ProjectsPage() {
  const labels = site.content.labels;

  return (
    <>
      <Helmet>
        <title>Projects | Yash Gulati</title>
        <meta name="description" content={`Projects by ${site.identity.name}`} />
        <link rel="canonical" href="https://yashgulati.tech/projects" />
      </Helmet>
      <PageShell activeRoute="projects">
        <section className="notebook-section">
          <div className="section-heading">
            <h2>Projects</h2>
            <ElectronicsSticker
              kind="esp32"
              note={site.stickers.find((s) => s.kind === "esp32")?.note ?? ""}
            />
          </div>

          <article className="project-highlight" style={{
            gridColumn: '1 / -1',
            padding: '20px',
            border: '1px solid rgba(43,43,43,.32)',
            background: 'rgba(243,239,227,.8)',
            marginBottom: '32px'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '23px' }}>{site.lab.name}</h3>
            <p style={{ margin: '6px 0', font: '13px/1.5 var(--mono)' }}>{site.lab.domain}</p>

            {site.lab.facts && site.lab.facts.length > 0 && (
              <ul style={{ margin: '12px 0', paddingLeft: '20px' }}>
                {site.lab.facts.map((fact, idx) => (
                  <li key={idx} style={{ margin: '4px 0' }}>{fact}</li>
                ))}
              </ul>
            )}

            {site.lab.status && (
              <p style={{
                margin: '12px 0',
                padding: '10px',
                borderLeft: '3px solid #1d3fb8',
                fontSize: '14px'
              }}>
                <strong>Status:</strong> {site.lab.status}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
              <a
                href={site.contact.labSite}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  minHeight: '44px',
                  padding: '0 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid #6b6b6b',
                  background: '#f3efe3',
                  font: '14px/1.4 var(--mono)',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                Lab site
              </a>
              <a
                href={site.contact.labBlog}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  minHeight: '44px',
                  padding: '0 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid #6b6b6b',
                  background: '#f3efe3',
                  font: '14px/1.4 var(--mono)',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                Lab blog
              </a>
            </div>
          </article>

          <div className="experiment-list">
            {site.tools.map((tool) => (
              <article className="experiment-card" key={tool.name}>
                <header className="experiment-card-header">
                  <p className="experiment-number">
                    {labels.experimentPrefix} {String(tool.n).padStart(2, "0")}
                  </p>
                  <h3>{tool.name}</h3>
                </header>
                {tool.what && <p className="experiment-description">{tool.what}</p>}
                {tool.stack && (
                  <p className="experiment-stack">
                    <strong>Built with:</strong> {tool.stack}
                  </p>
                )}
                {"finding" in tool && tool.finding && (
                  <p className="experiment-finding">
                    <strong>Finding:</strong> {tool.finding}
                  </p>
                )}
                {tool.note && <ToolNote note={tool.note} />}
                <div className="experiment-card-footer">
                  {tool.repo ? (
                    <a href={tool.repo} target="_blank" rel="noopener noreferrer">
                      Source on GitHub
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </PageShell>
    </>
  );
}
