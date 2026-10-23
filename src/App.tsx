import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import RoughScene from "./components/RoughScene";
import SerialMonitor from "./components/SerialMonitor";
import ElectronicsSticker from "./components/ElectronicsSticker";
import { site } from "./content/site";
import type { SiteSectionId } from "./content/site";
import { getVisibleSectionIds, hasContent } from "./content/visible-sections";

const sectionStickers = {
  about: "resistor",
  work: "esp32",
  lab: "analyzer",
  log: "timer",
  contact: "adapter",
} as const;

const EntryInput = z.object({
  label: z.string().transform(stripMarkup).pipe(z.string().min(1).max(40)),
  count: z.number().int().nonnegative(),
});
const LogInput = z.object({
  generatedAt: z.string().nullable(),
  sample: z.boolean(),
  windowDays: z.number().int().positive(),
  entries: z.array(z.unknown()),
});

type LogEntry = { label: string; count: number };
type ProbeLog = {
  generatedAt: string | null;
  sample: boolean;
  windowDays: number;
  entries: LogEntry[];
};
const sampleLog: ProbeLog = {
  generatedAt: null,
  sample: true,
  windowDays: 7,
  entries: [],
};
const colors = site.content.tabColors;
const labels = site.content.labels;
function stripMarkup(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

function validateLog(input: unknown): ProbeLog {
  const envelope = LogInput.parse(input);
  const entries = envelope.entries.map((item) => EntryInput.parse(item));
  const generatedAt = envelope.generatedAt;
  if (generatedAt !== null && Number.isNaN(Date.parse(generatedAt))) {
    throw new Error("Field log generatedAt must be a valid date.");
  }
  return {
    ...envelope,
    generatedAt,
    entries: entries
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 8),
  };
}

function sectionTitle(id: SiteSectionId) {
  return labels[id];
}

function App() {
  const [log, setLog] = useState<ProbeLog | null>(import.meta.env.DEV ? sampleLog : null);
  const [logError, setLogError] = useState(false);
  const [serialOpen, setSerialOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [active, setActive] = useState<SiteSectionId | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) return;
    let cancelled = false;
    fetch(site.content.logPath)
      .then((response) => {
        if (!response.ok) throw new Error(`Field log request failed with ${response.status}.`);
        return response.json() as Promise<unknown>;
      })
      .then((raw) => {
        const parsed = validateLog(raw);
        if (!cancelled) {
          setLog(parsed);
          setLogError(false);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error("Field log could not be loaded or validated.", error);
          setLogError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const productionLogVisible = Boolean(
    log && !log.sample && log.generatedAt && !Number.isNaN(Date.parse(log.generatedAt)) && log.entries.length,
  );
  const sections = useMemo(() => {
    return getVisibleSectionIds(import.meta.env.DEV || productionLogVisible)
      .map((id) => ({ id, title: sectionTitle(id) }));
  }, [productionLogVisible]);
  const tabs = useMemo(
    () =>
      sections.map((section, index) => ({
        ...section,
        color: colors[index % colors.length],
      })),
    [sections],
  );

  useEffect(() => {
    if (!sections.length) return;
    setActive((current) => sections.some((section) => section.id === current) ? current : sections[0].id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id as SiteSectionId);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [sections]);

  async function copyEmail() {
    if (!site.contact.email) return;
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <>
      <a className="plain-skip" href="/plain">{labels.plainLink}</a>
      <header className="cover" aria-label={site.identity.name}>
        <div className="cover-paper">
          <p className="cover-kicker">{labels.subjectLabel}</p>
          <h1>{site.identity.name}</h1>
          <p className="cover-subject">{site.identity.subject}</p>
          <p className="cover-intro">{site.identity.intro}</p>
          {site.identity.rolesSought.length > 0 && (
            <p className="cover-roles">{site.identity.rolesSought.join(" · ")}</p>
          )}
          <div className="cover-meta">
            {site.identity.city && <span>{site.identity.city}</span>}
            {site.identity.openToCities.length > 0 && (
              <span>{labels.openTo}: {site.identity.openToCities.join(" · ")}</span>
            )}
          </div>
          <div className="cover-actions">
            <a className="plain-link" href="/plain">{labels.plainLink}</a>
            <button className="serial-open" type="button" onClick={() => setSerialOpen(true)}>
              {labels.serialHint}
            </button>
          </div>
        </div>
      </header>

      <nav className="index-tabs" aria-label={labels.work}>
        {tabs.map((tab, index) => (
          <a
            className={`index-tab index-tab--${tab.color}${active === tab.id ? " is-active" : ""}`}
            href={`#${tab.id}`}
            key={tab.id}
            aria-current={active === tab.id ? "location" : undefined}
          >
            <span className="tab-number">{String(index + 1).padStart(2, "0")}</span>
            <span>{tab.title}</span>
          </a>
        ))}
      </nav>

      <main className="notebook">
        {sections.map((section, index) => (
          <section className={`notebook-section notebook-section--${section.id}`} id={section.id} key={section.id}>
            <p className="section-number">{labels.sectionNumber} {String(index + 1).padStart(2, "0")}</p>
            <div className="section-heading">
              <h2>{section.title}</h2>
              <ElectronicsSticker
                kind={sectionStickers[section.id]}
                note={site.stickers.find((sticker) => sticker.kind === sectionStickers[section.id])?.note ?? ""}
              />
            </div>
            {section.id === "about" && <AboutSection />}
            {section.id === "work" && <WorkSection />}
            {section.id === "lab" && <LabSection />}
            {section.id === "log" && (
              <LogSection
                log={import.meta.env.DEV ? sampleLog : log}
                error={logError}
                sample={import.meta.env.DEV}
                visible={productionLogVisible}
              />
            )}
            {section.id === "contact" && (
              <ContactSection copied={copied} copyError={copyError} onCopy={copyEmail} />
            )}
          </section>
        ))}
        <footer className="notebook-footer">
          <p>{labels.footer}</p>
          <button className="serial-open" type="button" onClick={() => setSerialOpen(true)}>
            {labels.openSerial}
          </button>
        </footer>
      </main>
      {serialOpen && (
        <SerialMonitor
          onClose={() => setSerialOpen(false)}
          visibleSections={sections.map((section) => section.id)}
        />
      )}
    </>
  );
}

function AboutSection() {
  const internship = site.internship;
  return (
    <div className="about-grid">
      {site.education.length > 0 && (
        <article className="paper-card">
          <h3>{labels.aboutEducation}</h3>
          {site.education.map((item) => (
            <div className="fact-row" key={`${item.degree}-${item.school}`}>
              <strong>{item.degree}</strong>
              <span>{item.school}</span>
              {item.year && <span>{item.year}</span>}
            </div>
          ))}
        </article>
      )}
      {hasContent(internship) && (
        <article className="paper-card">
          <h3>{labels.internshipLabel}</h3>
          {internship.org && <p><strong>{labels.organization}:</strong> {internship.org}</p>}
          {internship.program && <p><strong>{labels.program}:</strong> {internship.program}</p>}
          {internship.title && <p><strong>{labels.role}:</strong> {internship.title}</p>}
          {internship.dates && <p><strong>{labels.status}:</strong> {internship.dates}</p>}
        </article>
      )}
    </div>
  );
}

function WorkSection() {
  return (
    <>
      <p className="section-intro">{labels.workIntro}</p>
      <div className="experiment-list">
        {site.tools.map((tool) => (
          <article className="experiment-card" key={tool.name}>
            <p className="experiment-number">{labels.experimentPrefix} {String(tool.n).padStart(2, "0")}</p>
            <h3>{tool.name}</h3>
            {tool.aim && <p><strong>{labels.aim}:</strong> {tool.aim}</p>}
            {tool.result && <p><strong>{labels.result}:</strong> {tool.result}</p>}
            {tool.repo && <a href={tool.repo} target="_blank" rel="noreferrer">{labels.repo}</a>}
          </article>
        ))}
        {site.completed.map((project) => (
          <article className="experiment-card experiment-card--complete" key={project.name}>
            <p className="experiment-number">{labels.complete}</p>
            <h3>{project.name}</h3>
            {project.aim && <p><strong>{labels.aim}:</strong> {project.aim}</p>}
            {project.role && <p><strong>{labels.role}:</strong> {project.role}</p>}
            {project.stack && <p><strong>{labels.stack}:</strong> {project.stack}</p>}
            {project.publishFinding && project.finding && (
              <p><strong>{labels.finding}:</strong> {project.finding}</p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

function LabSection() {
  const hosts = site.lab.hosts;
  return (
    <>
      <div className="lab-heading">
        <div>
          <h3>{site.lab.name}</h3>
          {site.lab.domain && <p><strong>{labels.domainLabel}:</strong> {site.lab.domain}</p>}
        </div>
        {site.lab.status && <p className="lab-status"><strong>{labels.status}:</strong> {site.lab.status}</p>}
      </div>
      <RoughScene
        mode="topology"
        hosts={[...hosts]}
        domain={site.lab.domain}
        label={labels.topologyAria}
        description={labels.topologyDescription}
      />
      <p className="scene-caption">{labels.domainCaption}</p>
      {site.lab.facts.length > 0 && (
        <ul className="lab-facts">
          {site.lab.facts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
      )}
      {site.lab.repo ? (
        <p><a href={site.lab.repo} target="_blank" rel="noreferrer">{labels.repo}</a></p>
      ) : site.contact.labSite ? (
        <p><a href={site.contact.labSite} target="_blank" rel="noreferrer">{labels.labSiteLabel}</a></p>
      ) : null}
      <div className="credentials-grid">
        {site.skills.length > 0 && (
          <article className="paper-card">
            <h3>{labels.skills}</h3>
            <ul className="parts-list">{site.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </article>
        )}
        {(site.certifications.length > 0 || site.nextCerts) && (
          <article className="paper-card">
            <h3>{labels.certHeading}</h3>
            <ul className="cert-list">
              {site.certifications.map((cert) => (
                <li key={cert.name}>
                  <strong>{cert.name}</strong>
                  {cert.issuer && <span>{cert.issuer}</span>}
                  {cert.year && <span>{cert.year}</span>}
                  {cert.url && <a href={cert.url} target="_blank" rel="noreferrer">{labels.hideLinkLabel}</a>}
                </li>
              ))}
            </ul>
            {site.nextCerts && <p>{site.nextCerts}</p>}
          </article>
        )}
      </div>
    </>
  );
}

function LogSection({
  log,
  error,
  sample,
  visible,
}: {
  log: ProbeLog | null;
  error: boolean;
  sample: boolean;
  visible: boolean;
}) {
  const activeLog = log;
  if (!sample && !visible) return null;
  return (
    <>
      {sample && <p className="log-warning" role="note">{labels.logSample}</p>}
      {error && <p className="log-error" role="status">{labels.logError}</p>}
      {activeLog && (
        <>
          <p className="log-description">
            {labels.logDescriptionPrefix} {activeLog.windowDays}             {labels.logDescriptionSuffix} {activeLog.entries.length}
          </p>
          {activeLog.generatedAt && (
            <p className="log-updated">
              {labels.logUpdated}: {new Date(activeLog.generatedAt).toLocaleString()}
            </p>
          )}
          <RoughScene
            mode="tallies"
            counts={activeLog.entries.map((entry) => entry.count)}
            labels={activeLog.entries.map((entry) => entry.label)}
            label={labels.tallies}
          />
        </>
      )}
      <p className="scene-caption">{labels.logCaption}</p>
    </>
  );
}

function ContactSection({
  copied,
  copyError,
  onCopy,
}: {
  copied: boolean;
  copyError: boolean;
  onCopy: () => void;
}) {
  const { contact } = site;
  const socialItems = site.content.socialLinks.flatMap(({ label, key }) => {
    const href = contact[key];
    return href ? [{ label, href }] : [];
  });
  const resumes = contact.resumes.flatMap((resume) => {
    if (!resume.url) return [];
    return [
      <a className="contact-card" href={resume.url} download key={resume.label}>
        <span>{labels.resumeFile}</span><strong>{resume.label}</strong>
      </a>,
    ];
  });
  return (
    <div className="contact-grid">
      {contact.email && (
        <div className="contact-card">
          <span>{labels.contactEmail}</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <button className="copy-button" type="button" onClick={onCopy}>
            {copied ? labels.copied : labels.copy}
          </button>
          {copyError && <span role="alert">{labels.copyError}</span>}
        </div>
      )}
      {socialItems.map(({ label, href }) => (
        <a className="contact-card" href={href} target="_blank" rel="noreferrer" key={label}>
          <span>{label}</span><strong>{href}</strong>
        </a>
      ))}
      {contact.blog && (
        <a className="contact-card" href={contact.blog} target="_blank" rel="noreferrer">
          <span>{labels.blogLabel}</span><strong>{contact.blog}</strong>
        </a>
      )}
      {contact.labSite && (
        <a className="contact-card" href={contact.labSite} target="_blank" rel="noreferrer">
          <span>{labels.labSiteLabel}</span><strong>{contact.labSite}</strong>
        </a>
      )}
      {resumes}
    </div>
  );
}

export default App;
