import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import viteConfig from "../vite.config.js";

test("Vite embeds Netlify context and permits production builds with the accepted preview snapshot", () => {
  const previous = { CONTEXT: process.env.CONTEXT, URL: process.env.URL, POSTHOG_START_AT: process.env.POSTHOG_START_AT };
  try {
    process.env.URL = "https://shebonemo.no";
    for (const context of ["deploy-preview", "branch-deploy"]) {
      process.env.CONTEXT = context;
      const config = viteConfig({ command: "build" });
      assert.equal(JSON.parse(config.define.__NETLIFY_CONTEXT__), context);
      assert.equal(JSON.parse(config.define.__PRODUCTION_SITE_HOST__), "shebonemo.no");
    }
    process.env.CONTEXT = "production";
    process.env.POSTHOG_START_AT = "2026-11-10T14:23:45.123+01:00";
    assert.doesNotThrow(() => viteConfig({ command: "build" }));
    delete process.env.POSTHOG_START_AT;
    assert.throws(() => viteConfig({ command: "build" }), /POSTHOG_START_AT/);
    delete process.env.CONTEXT;
    assert.equal(JSON.parse(viteConfig({ command: "build" }).define.__NETLIFY_CONTEXT__), "unknown");
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

const analytics = readFileSync(new URL("../src/analytics/posthog.js", import.meta.url), "utf8")
  .replace(/^import .*;\r?\n/gm, "")
  .replaceAll("import.meta.env", "env")
  .replace("export function", "function");

function loadAnalytics({ prod = true, key = "test-key", host = "https://eu.i.posthog.com", hostname = "shebonemo.no", deployContext = "production", productionHost = "shebonemo.no" } = {}) {
  const calls = [];
  const context = {
    __NETLIFY_CONTEXT__: deployContext,
    __PRODUCTION_SITE_HOST__: productionHost,
    env: { PROD: prod, VITE_POSTHOG_KEY: key, VITE_POSTHOG_HOST: host },
    window: { location: { hostname, href: `https://${hostname}/dogs` } },
    posthog: {
      init: (...args) => calls.push(["init", ...args]),
      capture: (...args) => calls.push(["capture", ...args]),
    },
  };
  runInNewContext(analytics, context);
  return { calls, capture: context.capturePageview };
}

test("production captures explicit pageviews while excluding admin", () => {
  const { calls, capture } = loadAnalytics();
  capture("/dogs");
  capture("/admin");
  capture("/ADMIN/settings");
  assert.equal(calls.length, 2);
  assert.equal(calls[1][1], "$pageview");
  assert.equal(calls[1][2].pathname, "/dogs");
  assert.equal(calls[1][2].deployment_context, "production");
  assert.equal(calls[0][2].capture_pageview, false);
  assert.equal(calls[0][2].autocapture, false);
  assert.equal(calls[0][2].disable_session_recording, true);
  assert.equal(calls[0][2].respect_dnt, true);
});

test("development, localhost and missing client settings never initialize or send", () => {
  for (const options of [{ prod: false }, { key: "" }, { host: "" }, { hostname: "localhost" }, { hostname: "127.0.0.1" }, { hostname: "[::1]" }]) {
    const { calls, capture } = loadAnalytics(options);
    capture("/");
    assert.equal(calls.length, 0);
  }
});

test("preview, branch, unknown contexts and alternate hosts cannot send real visits", () => {
  for (const options of [
    { deployContext: "deploy-preview" },
    { deployContext: "branch-deploy" },
    { deployContext: "dev" },
    { deployContext: "unknown" },
    { productionHost: "" },
    { hostname: "deploy-preview-42--shebonemo.netlify.app" },
    { hostname: "posthog-migration--shebonemo.netlify.app" },
  ]) {
    const { calls, capture } = loadAnalytics(options);
    capture("/dogs");
    assert.equal(calls.length, 0);
  }
});

test("route tracking counts navigation once, including query changes and back/forward", () => {
  const source = readFileSync(new URL("../src/counter/TrackAllRoutes.jsx", import.meta.url), "utf8")
    .replace(/^import .*;\r?\n/gm, "")
    .replace("export default function", "function");
  const calls = [];
  const ref = { current: null };
  let effect;
  let location = { pathname: "/", search: "", key: "a" };
  const context = {
    useRef: () => ref,
    useEffect: (callback) => { effect = callback; },
    useLocation: () => location,
    capturePageview: (path) => calls.push(path),
  };
  runInNewContext(source, context);
  const navigate = (next) => {
    location = next;
    context.TrackAllRoutes();
    effect();
    effect(); // React Strict Mode effect replay must not duplicate a pageview.
  };
  navigate(location);
  navigate({ pathname: "/dogs", search: "", key: "b" });
  navigate({ pathname: "/dogs", search: "?page=2", key: "c" });
  navigate({ pathname: "/dogs", search: "", key: "b" });
  assert.deepEqual(calls, ["/", "/dogs", "/dogs", "/dogs"]);
});
