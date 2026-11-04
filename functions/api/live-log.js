export async function onRequestGet(context) {
  const namespace = context.env.LIVE_LOGS;
  if (!namespace) {
    return new Response("Live request logging is not configured.", { status: 503 });
  }

  const stub = namespace.get(namespace.idFromName("portfolio"));
  return stub.fetch(new Request("https://live-log.internal/connect", context.request));
}
