// Old browser bundles may still call this endpoint. Never write to Sanity.
export const handler = async () => ({
  statusCode: 410,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify({ counted: false, reason: "migrated-to-posthog" }),
});
