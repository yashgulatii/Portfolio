import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import RoughScene from "./components/RoughScene";
import ElectronicsSticker from "./components/ElectronicsSticker";
import PageShell from "./components/PageShell";
import ProfileCard from "./components/ProfileCard";
import { site } from "./content/site";
import type { SiteSectionId } from "./content/site";
import { getVisibleSectionIds } from "./content/visible-sections";

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

  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) {
          setActive(visible.target.id as SiteSectionId);
        } else {
          const firstSection = document.getElementById(sections[0]?.id);
          if (firstSection && firstSection.getBoundingClientRect().top > 0) {
            setActive(null);
          }
        }
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

  const coverHeader = (
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
          <Link to="/resume" style={{
            minHeight: '48px',
            padding: '0 16px',
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid rgba(43,43,43,.55)',
            background: 'transparent',
            font: '500 14px/1.5 var(--mono)',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            Resume
          </Link>
          <Link to="/projects" style={{
            minHeight: '48px',
            padding: '0 16px',
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid rgba(43,43,43,.55)',
            background: 'transparent',
            font: '500 14px/1.5 var(--mono)',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            Projects
          </Link>
          <a href="#contact" style={{
            minHeight: '48px',
            padding: '0 16px',
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid rgba(43,43,43,.55)',
            background: 'transparent',
            font: '500 14px/1.5 var(--mono)',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            Contact
          </a>
          <button
            className="serial-open"
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-serial"))}
          >
            {labels.serialHint}
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <PageShell activeSection={active} beforeMain={coverHeader}>
      <HomeAboutSection />
      {sections.map((section) => (
        <section className={`notebook-section notebook-section--${section.id}`} id={section.id} key={section.id}>
          <div className="section-heading">
            <h2>{section.title}</h2>
            <ElectronicsSticker
              kind={sectionStickers[section.id]}
              note={site.stickers.find((sticker) => sticker.kind === sectionStickers[section.id])?.note ?? ""}
            />
          </div>
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
    </PageShell>
  );
}

function HomeAboutSection() {
  const story = site.about.story?.[0];
  const education = site.education[0];
  const hasEducation = Boolean(
    education && (education.degree || education.school || education.years),
  );
  const hasInternship = Boolean(
    site.internship &&
    (site.internship.title || site.internship.org || site.internship.program || site.internship.dates),
  );
  const hasCertifications = Boolean(
    site.certifications.some((cert) => (
      Boolean(cert.name) || Boolean(cert.issuer) || Boolean(cert.year)
    )) || site.nextCerts,
  );

  return (
    <section className="notebook-section notebook-section--about-summary">
      <div className="section-heading">
        <h2>{labels.about}</h2>
        <ElectronicsSticker
          kind="resistor"
          note={site.stickers.find((sticker) => sticker.kind === "resistor")?.note ?? ""}
        />
      </div>
      {story && <p className="section-intro">{story}</p>}
      <div className="about-grid">
        {hasEducation && education && (
          <ProfileCard title={labels.aboutEducation}>
            {education.degree && <p>{education.degree}</p>}
            {education.school && <p>{education.school}</p>}
            {education.years && <p>{education.years}</p>}
          </ProfileCard>
        )}
        {hasInternship && (
          <ProfileCard title={labels.internshipLabel}>
            {site.internship.title && <p><strong>{labels.role}:</strong> {site.internship.title}</p>}
            {site.internship.org && <p><strong>{labels.organization}:</strong> {site.internship.org}</p>}
            {site.internship.program && <p><strong>{labels.program}:</strong> {site.internship.program}</p>}
            {site.internship.dates && <p><strong>{labels.dates}:</strong> {site.internship.dates}</p>}
          </ProfileCard>
        )}
        {hasCertifications && (
          <ProfileCard title={labels.certHeading} className="about-summary-card">
            {site.certifications.map((cert, index) => (
              (Boolean(cert.name) || Boolean(cert.issuer) || Boolean(cert.year)) && (
                <p key={`${cert.name}-${index}`}>
                  {Boolean(cert.name) && <strong>{cert.name}</strong>}
                  {Boolean(cert.issuer) && <span>, {cert.issuer}</span>}
                  {Boolean(cert.year) && <span>, {cert.year}</span>}
                </p>
              )
            ))}
            {site.nextCerts && <p className="margin-note about-next-certs">{site.nextCerts}</p>}
          </ProfileCard>
        )}
      </div>
      <Link to="/about" className="about-button">{site.ui.aboutMe}</Link>
    </section>
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
    const href = contact[key as keyof typeof contact];
    return href && typeof href === "string" ? [{ label, href }] : [];
  });
  const resumeLink = contact.resumePdf ? (
    <a className="contact-card" href={contact.resumePdf} download key="resume">
      <span>Resume (PDF)</span><strong>{contact.resumePdf}</strong>
    </a>
  ) : null;
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
      {contact.labBlog && (
        <a className="contact-card" href={contact.labBlog} target="_blank" rel="noreferrer">
          <span>Lab blog</span><strong>{contact.labBlog}</strong>
        </a>
      )}
      {resumeLink}
    </div>
  );
}

export default App;
