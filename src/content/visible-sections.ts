import { site } from "./site";
import type { SiteSectionId } from "./site";

export function hasContent(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasContent);
  if (value && typeof value === "object") return Object.values(value).some(hasContent);
  return typeof value === "string" ? value.length > 0 : value !== null && value !== undefined;
}

export function getVisibleSectionIds(showLog: boolean): SiteSectionId[] {
  const sections: SiteSectionId[] = [];
  const hasContactMethod = Boolean(
    site.contact.email ||
    site.contact.linkedin ||
    site.contact.github ||
    site.contact.blog ||
    site.contact.labSite ||
    site.contact.resumes.some((resume) => resume.url),
  );
  if (hasContent(site.education) || hasContent(site.internship)) sections.push("about");
  if (hasContent(site.tools) || hasContent(site.completed)) sections.push("work");
  if (hasContent(site.lab)) sections.push("lab");
  if (showLog) sections.push("log");
  if (hasContactMethod) sections.push("contact");
  return sections;
}
