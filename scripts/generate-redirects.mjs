import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const routesPath = resolve(root, "src/content/routes.json");
const redirectsPath = resolve(root, "public/_redirects");
const routes = JSON.parse(await readFile(routesPath, "utf8"));

if (!Array.isArray(routes)) {
  throw new Error("Route manifest must be an array.");
}

const paths = routes.map((route) => route.path);
if (new Set(paths).size !== paths.length || paths.some((path) => typeof path !== "string")) {
  throw new Error("Route manifest must contain unique string paths.");
}

const redirects = paths
  .filter((path) => path !== "/")
  .flatMap((path) => {
    if (!/^\/[a-z0-9-]+$/.test(path)) {
      throw new Error(`Unsupported route path: ${path}`);
    }
    return [`${path} /index.html 200`, `${path}/ /index.html 200`];
  });

await writeFile(redirectsPath, `${redirects.join("\n")}\n`);
console.log(`Generated ${redirects.length} Cloudflare Pages route rewrites.`);
