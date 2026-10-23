import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = resolve(root, "src/content");
const contentFiles = await readdir(sourceDirectory, { withFileTypes: true });
const content = await Promise.all(
  contentFiles
    .filter((entry) => entry.isFile())
    .map((entry) => readFile(resolve(sourceDirectory, entry.name), "utf8")),
);
const source = content.join("\n");
const blockedTerms = [
  ["TO", "DO"],
  ["lo", "rem"],
  ["place", "holder"],
  ["to be ", "added"],
].map((parts) => parts.join(""));
const violations = blockedTerms.filter((term) => source.toLowerCase().includes(term.toLowerCase()));
if (violations.length > 0) {
  throw new Error("Content validation failed: disallowed unfinished content was found.");
}

const siteSource = await readFile(resolve(sourceDirectory, "site.ts"), "utf8");
const compiled = await import("typescript").then(({ default: ts }) =>
  ts.transpileModule(siteSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText,
);
const { site } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

function validateUrls(value, path = "site") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateUrls(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  const urlFields = new Set([
    "url",
    "linkedin",
    "github",
    "blog",
    "labSite",
    "canonical",
    "openGraphImage",
    "labPath",
  ]);
  Object.entries(value).forEach(([key, item]) => {
    const fieldPath = `${path}.${key}`;
    const inLabels = fieldPath.startsWith("site.content.labels.");
    const isRepoUrl = key === "repo" && !inLabels;
    const isUrl = urlFields.has(key) && !inLabels;
    const looksLikeUrl = typeof item === "string" && /^https?:\/\//i.test(item);
    if ((isUrl || isRepoUrl || looksLikeUrl) && typeof item === "string" && !item.startsWith("https://")) {
      throw new Error(`Content validation failed: ${fieldPath} must use HTTPS.`);
    }
    validateUrls(item, fieldPath);
  });
}

validateUrls(site);
