import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ZONE_ID = process.env.CF_ZONE_ID;
const DRY_RUN = process.argv.includes("--dry-run");

if (!CF_API_TOKEN || !CF_ZONE_ID) {
  console.error("Error: CF_API_TOKEN and CF_ZONE_ID environment variables are required.");
  console.error("Set them before running this script:");
  console.error("  export CF_API_TOKEN=your_token");
  console.error("  export CF_ZONE_ID=your_zone_id");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const outputPath = resolve(root, "public/probe-log.json");

const WINDOW_DAYS = 7;
const endDate = new Date();
const startDate = new Date();
startDate.setDate(startDate.getDate() - WINDOW_DAYS);

const query = `
  query GetPathCounts($zoneTag: string!, $start: Time!, $end: Time!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        httpRequestsAdaptiveGroups(
          filter: {
            datetime_geq: $start
            datetime_lt: $end
          }
          limit: 10000
        ) {
          count
          dimensions {
            clientRequestPath
            edgeResponseStatus
          }
        }
      }
    }
  }
`;

const variables = {
  zoneTag: CF_ZONE_ID,
  start: startDate.toISOString(),
  end: endDate.toISOString(),
};

console.log(`Fetching 404 requests for the last ${WINDOW_DAYS} days...`);
console.log(`Date range: ${variables.start.split("T")[0]} to ${variables.end.split("T")[0]}`);

try {
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Cloudflare API request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", JSON.stringify(result.errors, null, 2));
    throw new Error("GraphQL query returned errors");
  }

  const groups = result.data?.viewer?.zones?.[0]?.httpRequestsAdaptiveGroups;

  if (!groups || groups.length === 0) {
    console.log("No 404 requests found in the specified window.");
    if (!DRY_RUN) {
      await writeFile(
        outputPath,
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            sample: false,
            windowDays: WINDOW_DAYS,
            entries: [],
          },
          null,
          2,
        ),
      );
      console.log(`Wrote empty log to ${outputPath}`);
    }
    process.exit(0);
  }

  const pathCounts = new Map();
  for (const group of groups) {
    if (group.dimensions.edgeResponseStatus !== 404) continue;
    const path = group.dimensions.clientRequestPath;
    const count = group.count;
    pathCounts.set(path, (pathCounts.get(path) || 0) + count);
  }

  const validRoutes = new Set(["/", "/about", "/projects", "/resume"]);
  const validChar = /^[A-Za-z0-9\/._~%-]+$/;

  const entries = Array.from(pathCounts.entries())
    .map(([path, count]) => {
      let normalized = path.split("?")[0];
      if (normalized.length > 40) return null;
      if (!validChar.test(normalized)) return null;
      if (normalized === "/favicon.ico" || /^\/apple-touch-icon.*\.png$/i.test(normalized)) return null;
      if (validRoutes.has(normalized)) return null;
      return { label: normalized, count };
    })
    .filter((entry) => entry !== null)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 8);

  const output = {
    generatedAt: new Date().toISOString(),
    sample: false,
    windowDays: WINDOW_DAYS,
    entries,
  };

  console.log("\nFinal entries:");
  console.log(JSON.stringify(output, null, 2));

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Would write to:", outputPath);
  } else {
    await writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`\nWrote ${entries.length} entries to ${outputPath}`);
    console.log("Review the output, then commit and push to redeploy.");
  }
} catch (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
