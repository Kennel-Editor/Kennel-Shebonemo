import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  useCdn: true,
  apiVersion: process.env.SANITY_API_VERSION,
});

export async function handler(event) {
  const data = await sanityClient.fetch('*[_type == "yourDocumentType"]');
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
