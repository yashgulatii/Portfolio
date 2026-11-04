const WINDOW_DAYS = 7;
const BUCKET_MS = 5 * 60 * 1000;

export class LiveLogs {
  constructor(ctx) {
    this.ctx = ctx;
    this.ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS request_counts (
        hour_bucket INTEGER NOT NULL,
        path TEXT NOT NULL,
        count INTEGER NOT NULL,
        PRIMARY KEY (hour_bucket, path)
      )`,
    );
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/record" && request.method === "POST") {
      return this.record(request);
    }

    if (url.pathname === "/connect" && request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      return this.connect();
    }

    return new Response("Not found.", { status: 404 });
  }

  async record(request) {
    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      console.error("Live request log received invalid JSON.", error);
      return new Response("Invalid JSON.", { status: 400 });
    }

    if (typeof payload.path !== "string" || !payload.path.startsWith("/") || payload.path.length > 512) {
      return new Response("Invalid request path.", { status: 400 });
    }

    const now = Date.now();
    const currentBucket = Math.floor(now / BUCKET_MS);
    const firstBucket = Math.floor((now - WINDOW_DAYS * 24 * 60 * 60 * 1000) / BUCKET_MS);
    this.ctx.storage.sql.exec(
      `INSERT INTO request_counts (hour_bucket, path, count)
       VALUES (?, ?, 1)
       ON CONFLICT (hour_bucket, path) DO UPDATE SET count = count + 1`,
      currentBucket,
      payload.path,
    );
    this.ctx.storage.sql.exec("DELETE FROM request_counts WHERE hour_bucket < ?", firstBucket);

    const snapshot = this.snapshot(now, firstBucket);
    const message = JSON.stringify(snapshot);
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(message);
      } catch (error) {
        console.error("Could not send a live request-log update.", error);
      }
    }

    return new Response("Recorded.", { status: 202 });
  }

  snapshot(
    now = Date.now(),
    firstBucket = Math.floor((now - WINDOW_DAYS * 24 * 60 * 60 * 1000) / BUCKET_MS),
  ) {
    const entries = [];
    for (const row of this.ctx.storage.sql.exec(
      `SELECT path, SUM(count) AS count
       FROM request_counts
       WHERE hour_bucket >= ?
       GROUP BY path
       ORDER BY count DESC, path ASC
       LIMIT 8`,
      firstBucket,
    )) {
      const path = row.path;
      const label = path.length <= 40 ? path : `${path.slice(0, 27)}...${path.slice(-10)}`;
      entries.push({ label, count: Number(row.count) });
    }

    return {
      generatedAt: new Date(now).toISOString(),
      sample: false,
      windowDays: WINDOW_DAYS,
      entries,
    };
  }

  connect() {
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.ctx.acceptWebSocket(server);
    server.send(JSON.stringify(this.snapshot()));
    return new Response(null, { status: 101, webSocket: client });
  }
}

export default {
  fetch() {
    return new Response("Not found.", { status: 404 });
  },
};
