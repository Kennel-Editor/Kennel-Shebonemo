import posthog from "posthog-js";
/* global __NETLIFY_CONTEXT__, __PRODUCTION_SITE_HOST__ */

const enabled = import.meta.env.PROD &&
  __NETLIFY_CONTEXT__ === "production" &&
  window.location.hostname === __PRODUCTION_SITE_HOST__ &&
  !["localhost", "127.0.0.1", "::1", "[::1]"].includes(window.location.hostname) &&
  Boolean(import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST);

if (enabled) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    respect_dnt: true,
  });
}

export function capturePageview(pathname) {
  if (!enabled || /^\/admin(?:\/|$)/i.test(pathname)) return;
  posthog.capture("$pageview", {
    $current_url: window.location.href,
    pathname,
    deployment_context: __NETLIFY_CONTEXT__,
  });
}
