import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const backendClient = createClient({
  projectId: 'woweegpk',
  dataset: 'production',
  apiVersion: '2025-09-16',
  useCdn: false,
})
// export const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
//   apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
//   useCdn: false,
// })