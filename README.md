# Yash Gulati portfolio

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; the static site is written to `dist/`.

## Content updates

Add identity, project, lab, skill, and contact details in `src/content/site.ts`.

## Updating the log

The probe log shows 404 requests to non-existent paths over the last 7 days.

1. Create a Cloudflare API token with Analytics:Read permission for your zone only at https://dash.cloudflare.com/profile/api-tokens
2. Set environment variables:
   ```sh
   export CF_API_TOKEN=your_token_here
   export CF_ZONE_ID=your_zone_id_here
   ```
3. Run `npm run probe-log` to fetch data and update `public/probe-log.json`
4. Review the output, then commit and push to trigger a Cloudflare Pages redeploy

Use `npm run probe-log -- --dry-run` to preview without writing.

The `public/_headers` file contains the deployment security headers.
