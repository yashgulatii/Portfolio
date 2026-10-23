import { defineConfig } from "vite";
import type { Connect, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";

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

export default defineConfig({
  plugins: [react(), plainRoutePlugin],
});
