export async function onRequest(context) {
  const response = await context.next();
  const path = new URL(context.request.url).pathname;

  if (path === "/api/live-log") return response;

  const namespace = context.env.LIVE_LOGS;
  if (!namespace) {
    console.error("Live request logging is not configured. Bind the LIVE_LOGS Durable Object.");
    return response;
  }

  const stub = namespace.get(namespace.idFromName("portfolio"));
  const recordRequest = new Request("https://live-log.internal/record", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });

  context.waitUntil(
    stub.fetch(recordRequest).then((result) => {
      if (!result.ok) {
        console.error(`Live request logging failed with status ${result.status}.`);
      }
    }).catch((error) => {
      console.error("Live request logging failed.", error);
    }),
  );

  return response;
}
