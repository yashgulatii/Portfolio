import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const source = await readFile(resolve(root, "src/content/site.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { site } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const escape = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const present = (value) => value !== null && value !== undefined && value !== "";
const field = (label, value) => present(value) ? `<p><strong>${escape(label)}:</strong> ${escape(value)}</p>` : "";
const list = (items) => items.length ? `<ul>${items.join("")}</ul>` : "";
const toolItems = site.tools.map((tool) => `<li>
  <h3>${escape(site.content.labels.experimentPrefix ?? "Exp.")} ${String(tool.n).padStart(2, "0")} / ${escape(tool.name)}</h3>
  ${field(site.content.labels.aim, tool.aim)}
  ${present(tool.result) ? field(site.content.labels.result, tool.result) : ""}
  ${present(tool.repo) ? `<p><a href="${escape(tool.repo)}" rel="noopener noreferrer">${escape(site.content.labels.repo)}</a></p>` : ""}
</li>`);
const completedItems = site.completed.map((project) => `<li>
  <h3>${escape(project.name)} <span class="completed">${escape(site.content.labels.complete)}</span></h3>
  ${field(site.content.labels.aim, project.aim)}
  ${field(site.content.labels.role, project.role)}
  ${field(site.content.labels.stack, project.stack)}
  ${project.publishFinding ? field(site.content.labels.finding, project.finding) : ""}
</li>`);
const educationItems = site.education.map((item) => `<li>
  <strong>${escape(item.degree)}</strong> — ${escape(item.school)}
  ${present(item.year) ? ` (${escape(item.year)})` : ""}
</li>`);
const certItems = site.certifications.map((cert) => `<li>
  ${escape(cert.name)}
  ${present(cert.issuer) ? ` — ${escape(cert.issuer)}` : ""}
  ${present(cert.year) ? ` · ${escape(cert.year)}` : ""}
  ${present(cert.url) ? ` · <a href="${escape(cert.url)}" rel="noopener noreferrer">${escape(cert.url)}</a>` : ""}
</li>`);
const skillItems = site.skills.map((skill) => `<li>${escape(skill)}</li>`);
const labItems = site.lab.hosts.map((host) => `<li><strong>${escape(host.id)}</strong> — ${escape(host.os)}; ${escape(host.roles)}</li>`);
const contactItems = [
  present(site.contact.email) ? `<li>${escape(site.content.labels.contactEmail)}: <a href="mailto:${escape(site.contact.email)}">${escape(site.contact.email)}</a></li>` : "",
  ...site.content.socialLinks.map(({ label, key }) => {
    const value = site.contact[key];
    return present(value) ? `<li>${escape(label)}: <a href="${escape(value)}" rel="noopener noreferrer">${escape(value)}</a></li>` : "";
  }),
  ...site.contact.resumes.map((resume) => present(resume.url)
    ? `<li><a href="${escape(resume.url)}" download rel="noopener noreferrer">${escape(resume.label)}</a></li>`
    : ""),
  present(site.contact.blog) ? `<li>${escape(site.content.labels.fieldNotes)}: <a href="${escape(site.contact.blog)}" rel="noopener noreferrer">${escape(site.contact.blog)}</a></li>` : "",
  present(site.contact.labSite) ? `<li>${escape(site.content.labels.labSiteLabel)}: <a href="${escape(site.contact.labSite)}" rel="noopener noreferrer">${escape(site.contact.labSite)}</a></li>` : "",
].filter(Boolean);
const intern = site.internship;
const internshipBody = [
  field(site.content.labels.organization, intern.org),
  field(site.content.labels.program, intern.program),
  field(site.content.labels.role, intern.title),
  field(site.content.labels.status, intern.dates),
].join("");
const sections = [
  `<section><h2>${escape(site.content.labels.about)}</h2>${list(educationItems)}${internshipBody ? `<h3>${escape(site.content.labels.internship)}</h3>${internshipBody}` : ""}</section>`,
  `<section><h2>${escape(site.content.labels.work)}</h2>${list([...toolItems, ...completedItems])}</section>`,
  `<section><h2>${escape(site.content.labels.lab)}</h2><h3>${escape(site.lab.name)}</h3><p>${escape(site.lab.domain)}</p>${field(site.content.labels.status, site.lab.status)}${list(labItems)}${list(site.lab.facts.map((fact) => `<li>${escape(fact)}</li>`))}  ${present(site.lab.repo)
    ? `<p><a href="${escape(site.lab.repo)}" rel="noopener noreferrer">${escape(site.content.labels.repo)}</a></p>`
    : present(site.contact.labSite)
      ? `<p><a href="${escape(site.contact.labSite)}" rel="noopener noreferrer">${escape(site.contact.labSite)}</a></p>`
      : ""}</section>`,
  `<section><h2>${escape(site.content.labels.skills)}</h2>${list(skillItems)}<h3>${escape(site.content.labels.certHeading)}</h3>${list(certItems)}${present(site.nextCerts) ? `<p>${escape(site.nextCerts)}</p>` : ""}</section>`,
  `<section><h2>${escape(site.content.labels.contact)}</h2>${list(contactItems)}</section>`,
].join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'">
  <title>${escape(site.content.labels.plainTitle)} — ${escape(site.identity.name)}</title>
  <meta name="description" content="${escape(site.content.labels.plainDescription)}">
  <link rel="canonical" href="${escape(site.content.labels.canonical)}plain">
  <style>
    :root { color-scheme: light; font-family: Arial, Helvetica, sans-serif; color: #2b2b2b; background: #fff; }
    body { max-width: 760px; margin: 0 auto; padding: 2rem 1.25rem 4rem; font-size: 16px; line-height: 1.6; }
    a { color: #1d3fb8; } a:focus-visible { outline: 2px solid #1d3fb8; outline-offset: 3px; }
    h1 { margin: .3rem 0; font-size: 2.4rem; line-height: 1.15; } h2 { margin: 2rem 0 .5rem; font-size: 1.35rem; border-bottom: 1px solid #bbb; }
    h3 { margin: .5rem 0; font-size: 1.05rem; } p { margin: .45rem 0; }
    .return { display: inline-block; margin-bottom: 1.4rem; } .kicker { font-family: Consolas, monospace; text-transform: uppercase; letter-spacing: .08em; }
    .subtitle { font-size: 1.2rem; } ul { padding-left: 1.25rem; } li { margin: .65rem 0; }
    .completed { color: #c62828; font-family: Consolas, monospace; font-size: .8em; }
    @media print { body { max-width: none; padding: 0; font-size: 11pt; } .return { display: none; } a { color: inherit; text-decoration: none; } h2 { break-after: avoid; } li { break-inside: avoid; } }
  </style>
</head>
<body>
  <a class="return" href="/">${escape(site.content.labels.resumeReturn)}</a>
  <main>
    <p class="kicker">${escape(site.content.labels.plainTitle)}</p>
    <h1>${escape(site.identity.name)}</h1>
    <p class="subtitle">${escape(site.identity.subject)}</p>
    <p>${escape(site.identity.intro)}</p>
    <p><strong>${escape(site.content.labels.city)}:</strong> ${escape(site.identity.city)}</p>
    <p><strong>${escape(site.content.labels.openTo)}:</strong> ${site.identity.openToCities.map(escape).join(", ")}</p>
    ${sections}
  </main>
</body>
</html>`;

const output = resolve(root, "public/plain/index.html");
await mkdir(resolve(root, "public/plain"), { recursive: true });
await writeFile(output, html, "utf8");
