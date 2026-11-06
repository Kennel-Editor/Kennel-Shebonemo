import test from "node:test";
import assert from "node:assert/strict";
import { fetchPosthogStats } from "../src/counter/utils/posthogStats.js";

test("HTML from the Vite fallback produces an actionable local setup error", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response("<!doctype html><html></html>", {
      headers: { "Content-Type": "text/html" },
    });
    await assert.rejects(fetchPosthogStats({ range: "all" }), /Netlify Dev/);
  } finally {
    globalThis.fetch = original;
  }
});

test("JSON configuration errors from the function remain visible", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ error: "Mangler POSTHOG_START_AT" }), {
      status: 503, headers: { "Content-Type": "application/json" },
    });
    await assert.rejects(fetchPosthogStats({ range: "all" }), /Mangler POSTHOG_START_AT/);
  } finally {
    globalThis.fetch = original;
  }
});

test("valid function results are returned unchanged", async () => {
  const original = globalThis.fetch;
  const data = { sessionsTotal: 486, historicalUniques: 353, posthogUniques: 4 };
  try {
    globalThis.fetch = async () => new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    assert.deepEqual(await fetchPosthogStats({ range: "all" }), data);
  } finally {
    globalThis.fetch = original;
  }
});

test("StrictMode consumers share a pending request and refresh still fetches again", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  let release;
  try {
    globalThis.fetch = async (_, options) => {
      calls++;
      assert.equal(options.signal, undefined);
      await new Promise((resolve) => { release = resolve; });
      return new Response(JSON.stringify({ uniquesTotal: 353 }), {
        headers: { "Content-Type": "application/json" },
      });
    };
    const first = fetchPosthogStats({ range: "today" });
    const second = fetchPosthogStats({ range: "today" });
    assert.equal(first, second);
    assert.equal(calls, 1);
    release();
    assert.deepEqual(await first, { uniquesTotal: 353 });
    const refresh = fetchPosthogStats({ range: "today" });
    assert.equal(calls, 2);
    release();
    await refresh;
  } finally {
    globalThis.fetch = original;
  }
});
