import { createClient } from "@sanity/client";

const projectId =
  import.meta.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  import.meta.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET;
const apiVersion =
  import.meta.env.VITE_SANITY_API_VERSION || process.env.SANITY_API_VERSION;

const sanityClient = createClient({
  projectId: projectId,
  dataset: dataset,
  useCdn: true,
  apiVersion: apiVersion,
});

export default sanityClient;
