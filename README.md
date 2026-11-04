# Yash Gulati portfolio

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; the static site is written to `dist/`.

## Content updates

Add identity, project, lab, skill, and contact details in `src/content/site.ts`.

## Live request log

The Cloudflare Pages middleware records request paths after the response is served. A Durable Object keeps five-minute path-count buckets for a rolling seven-day window and pushes updated totals to connected browsers over WebSockets. Query strings, IP addresses, and other visitor details are not stored. The streaming endpoint itself is excluded.

Deploy the Durable Object Worker from the repository root:

```sh
npx wrangler deploy --config workers/live-log/wrangler.toml
```

Then bind it to the Pages project:

1. In Cloudflare, open **Workers & Pages**, select the Pages project, then open **Settings > Bindings**.
2. Add a **Durable Object** binding named `LIVE_LOGS` and select the `LiveLogs` namespace from `portfolio-live-log`.
3. Redeploy the Pages project so its middleware and binding take effect.

The `functions/` directory contains the request middleware and live WebSocket endpoint. The Pages project must deploy with Cloudflare Pages Functions enabled. Local Vite development continues to show sample log data.

The `public/_headers` file contains the deployment security headers.
