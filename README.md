# Yash Gulati portfolio

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; the static site is written to `dist/`.
The `/plain` resume page is generated from `src/content/site.ts` before development
and production builds, so edit the content file rather than `public/plain/index.html`.

## Content updates

- Add identity, project, lab, skill, and contact details in `src/content/site.ts`.
- Update the weekly field log in `public/probe-log.json`. Keep `sample: true` until the
  entries are real; the page displays a sample-data warning when it is true.
- Replace each `TODO` only with details supplied by Yash.

The `public/_headers` file contains the requested deployment security headers.
