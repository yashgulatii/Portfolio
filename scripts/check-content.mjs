import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = resolve(root, "src");

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)));
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

const sourceFiles = await collectFiles(sourceDirectory);
const indexHtml = resolve(root, "index.html");
sourceFiles.push(indexHtml);

const fileContents = await Promise.all(
  sourceFiles.map(async (path) => ({
    path,
    content: await readFile(path, "utf8"),
  })),
);

// Check for em dash and en dash
const dashViolations = fileContents.filter(({ content }) =>
  content.includes("—") || content.includes("–"),
);
if (dashViolations.length > 0) {
  console.error("Em dash or en dash found in:", dashViolations.map(({ path }) => path));
  throw new Error("Content validation failed: em dash (U+2014) or en dash (U+2013) found.");
}

const contentDir = resolve(root, "src/content");
const contentFiles = await readdir(contentDir, { withFileTypes: true });
const contentData = await Promise.all(
  contentFiles
    .filter((entry) => entry.isFile())
    .map((entry) => readFile(resolve(contentDir, entry.name), "utf8")),
);
const contentSource = contentData.join("\n");

// Banned words/phrases (case-insensitive)
const bannedPhrases = [
  "leverage", "leveraging", "robust", "seamless", "seamlessly", "delve",
  "passionate", "passion for", "journey", "showcase", "showcasing", "crafted",
  "craft", "cutting-edge", "state-of-the-art", "holistic", "synergy", "tapestry",
  "dive into", "deep dive", "unlock", "empower", "elevate", "game-changer",
  "in today's", "ever-evolving", "world of", "I am excited", "dedicated to",
  "proven track record",
];
const bannedViolations = bannedPhrases.filter((phrase) =>
  contentSource.toLowerCase().includes(phrase.toLowerCase()),
);
if (bannedViolations.length > 0) {
  console.error("Banned words/phrases found:", bannedViolations);
  throw new Error("Content validation failed: banned words or phrases found.");
}

// Phone number pattern
const phonePattern = /\+?\d[\d\s-]{9,}\d/;
if (phonePattern.test(contentSource)) {
  throw new Error("Content validation failed: phone number pattern found in src/content.");
}

// Existing blocked terms
const blockedTerms = [
  ["TO", "DO"],
  ["lo", "rem"],
  ["place", "holder"],
  ["to be ", "added"],
].map((parts) => parts.join(""));
const violations = blockedTerms.filter((term) =>
  contentSource.toLowerCase().includes(term.toLowerCase()),
);
if (violations.length > 0) {
  throw new Error("Content validation failed: disallowed unfinished content was found.");
}

const siteSource = await readFile(resolve(contentDir, "site.ts"), "utf8");
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
