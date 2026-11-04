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
    site.contact.labBlog ||
    site.contact.resumePdf,
  );
  // Home page should only show: lab, log (conditional), and contact
  // "about" and "work" are now separate routes
  if (hasContent(site.lab)) sections.push("lab");
  if (showLog) sections.push("log");
  if (hasContactMethod) sections.push("contact");
  return sections;
}
