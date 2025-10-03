import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET!;

export const sanityClient = createClient({
  projectId, dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: true,
});

export const sanityWriteClient = createClient({
  projectId, dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_WRITE_TOKEN, // <-- important
  useCdn: false,
});