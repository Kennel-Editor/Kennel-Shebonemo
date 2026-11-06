// Retired Sanity statistics API. Use getPosthogStats instead.
export const handler = async () => ({
  statusCode: 410,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify({ error: "Statistikk er flyttet til getPosthogStats" }),
});
