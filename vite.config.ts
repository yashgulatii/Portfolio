import { defineConfig } from "vite";
import type { Connect, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";

const servePlainPage = (middlewares: Connect.Server) => {
  middlewares.use(async (request, response, next) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      next();
      return;
    }
    const pathname = new URL(request.url ?? "/", "http://vite.local").pathname;
    if (pathname !== "/plain" && pathname !== "/plain/") {
      next();
      return;
    }
    try {
      const html = await readFile(new URL("./public/plain/index.html", import.meta.url), "utf8");
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(request.method === "HEAD" ? undefined : html);
    } catch (error) {
      next(error);
    }
  });
};

const plainRoutePlugin: Plugin = {
  name: "serve-generated-plain-page",
  configureServer(server) {
    servePlainPage(server.middlewares);
  },
  configurePreviewServer(server) {
    servePlainPage(server.middlewares);
  },
};

const pagesPreviewPlugin: Plugin = {
  name: "preview-cloudflare-pages-routing",
  async configurePreviewServer(server) {
    const outputRoot = resolve(server.config.root, server.config.build.outDir);
    const [redirects, notFoundPage] = await Promise.all([
      readFile(resolve(outputRoot, "_redirects"), "utf8"),
      readFile(resolve(outputRoot, "404.html"), "utf8"),
    ]);
    const rewrittenPaths = new Set(
      redirects
        .split(/\r?\n/)
        .map((line) => line.trim().split(/\s+/)[0])
        .filter((path) => path?.startsWith("/")),
    );

    server.middlewares.use(async (request, response, next) => {
      if (request.method !== "GET" && request.method !== "HEAD") {
        next();
        return;
      }

      const requestUrl = new URL(request.url ?? "/", "http://vite.local");
      if (rewrittenPaths.has(requestUrl.pathname)) {
        request.url = `/index.html${requestUrl.search}`;
        next();
        return;
      }

      let diskPath: string;
      try {
        diskPath = resolve(outputRoot, `.${decodeURIComponent(requestUrl.pathname)}`);
      } catch (error) {
        next(error);
        return;
      }
      if (diskPath !== outputRoot && !diskPath.startsWith(`${outputRoot}${sep}`)) {
        next();
        return;
      }

      try {
        await stat(diskPath);
        next();
      } catch (error) {
        if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
          next(error);
          return;
        }
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(request.method === "HEAD" ? undefined : notFoundPage);
      }
    });
  },
};

export default defineConfig({
  plugins: [react(), plainRoutePlugin, pagesPreviewPlugin],
});
