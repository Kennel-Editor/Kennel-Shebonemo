import { createClient } from "@sanity/client";

const projectId =
  process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-03-02";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  perspective: "raw",
});
