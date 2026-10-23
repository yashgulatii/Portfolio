import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { site } from "../content/site";
import type { SiteSectionId } from "../content/site";

type Props = { onClose: () => void; visibleSections: SiteSectionId[] };
type Line = { command?: string; output: string };

export default function SerialMonitor({ onClose, visibleSections }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<Line[]>([{ output: site.content.labels.serialWelcome }]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    inputRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;
    const command = input.value.trim();
    if (!command) return;
    input.value = "";
    if (command === site.serial.clearCommand) {
      setHistory([]);
      return;
    }
    if (command === site.serial.exitCommand) {
      onClose();
      return;
    }
    if (command === site.serial.terminalCommand) {
      setHistory((current) => [...current, { command, output: site.content.labels.resumeMessage }]);
      window.location.assign("/plain");
      onClose();
      return;
    }
    const output = commandResult(command, visibleSections);
    setHistory((current) => [...current, { command, output }]);
  }

  return (
    <dialog
      ref={dialogRef}
      className="serial-dialog"
      aria-labelledby="serial-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="serial-paper">
        <div className="serial-topline">
          <h2 id="serial-title">{site.content.labels.serialTitle}</h2>
          <button className="text-button" type="button" onClick={onClose} aria-label={site.content.labels.closeSerial}>
            close ×
          </button>
        </div>
        <div className="serial-output" aria-live="polite" aria-relevant="additions text">
          {history.map((line, index) => (
            <p className="serial-line" key={`${index}-${line.command ?? "welcome"}`}>
              {line.command && <span>&gt; {line.command}<br /></span>}
              {line.output}
            </p>
          ))}
          <form className="serial-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="serial-command">{site.content.labels.prompt}</label>
            <span aria-hidden="true">&gt;</span>
            <input ref={inputRef} id="serial-command" autoComplete="off" spellCheck={false} />
            <span className="serial-cursor" aria-hidden="true">_</span>
          </form>
        </div>
      </div>
    </dialog>
  );
}

function commandResult(command: string, visibleSections: SiteSectionId[]) {
  const projects = [
    ...site.tools.map((project) => project.name),
    ...site.completed.map((project) => project.name),
  ].join("  ");
  const contacts = [
    site.contact.email && `${site.content.labels.contactEmail}: ${site.contact.email}`,
    ...site.content.socialLinks.map(({ label, key }) =>
      site.contact[key] ? `${label}: ${site.contact[key]}` : null,
    ),
    site.contact.blog && `${site.content.labels.blogLabel}: ${site.contact.blog}`,
    site.contact.labSite && `${site.content.labels.labSiteLabel}: ${site.contact.labSite}`,
    ...site.contact.resumes.map((resume) =>
      resume.url ? `${resume.label}: ${resume.url}` : null,
    ),
  ].filter((line): line is string => Boolean(line)).join("\n");
  const availableCommands = site.serial.commands.filter((entry) => {
    if (entry === site.serial.projectCommand) return site.tools.length + site.completed.length > 0;
    if (entry === site.serial.certCommand) return site.certifications.length > 0;
    if (entry === site.serial.contactCommand) return Boolean(contacts);
    return true;
  });
  switch (command) {
    case site.serial.helpCommand:
      return `${site.content.labels.serialHelp}\n${availableCommands.join(" · ")}`;
    case site.serial.whoamiCommand:
      return `${site.identity.name}\n${site.identity.subject}\n${site.identity.intro}`;
    case site.serial.listCommand:
      return visibleSections.map((id) => site.content.labels[id]).join("  ");
    case site.serial.projectCommand:
      return projects;
    case site.serial.certCommand:
      return site.certifications.map((certificate) => certificate.name).join("  ");
    case site.serial.contactCommand:
      return contacts;
    case site.serial.systemCommand:
      return site.content.labels.uname;
    case site.serial.sudoCommand:
      return site.content.labels.exitMessage;
    default:
      return `${site.content.labels.notFound}: ${command}`;
  }
}
