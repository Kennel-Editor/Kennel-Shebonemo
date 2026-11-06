const inFlight = new Map();

export function fetchPosthogStats(query, signal) {
  const params = new URLSearchParams(query);
  params.sort();
  const url = `/.netlify/functions/getPosthogStats?${params}`;
  if (signal) return requestStats(url, signal);
  // Share only pending requests, including StrictMode's repeated effect setup.
  // Remove on settlement so the refresh button always gets fresh statistics.
  if (!inFlight.has(url)) {
    inFlight.set(url, requestStats(url).finally(() => inFlight.delete(url)));
  }
  return inFlight.get(url);
}

async function requestStats(url, signal) {
  const response = await fetch(url, { signal });
  if (!(response.headers.get("content-type") || "").includes("application/json")) {
    throw new Error(`Statistikk-endepunktet returnerte ikke JSON (HTTP ${response.status}). Lokalt må siden åpnes via Netlify Dev, ikke direkte på Vite-porten.`);
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Kunne ikke hente besøksstatistikk");
  return data;
}
