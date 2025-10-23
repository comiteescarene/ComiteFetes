// sanity/sanity.config.ts
import {defineConfig} from "sanity";
import {deskTool}     from "sanity/desk";
import {visionTool}   from "@sanity/vision";
import schemaTypes    from "./schemas";
import structure      from "./deskStructure";

export default defineConfig({
  name:  "default",
  title: "Comité des Fêtes",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID!,
  dataset:  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    deskTool({ structure }), // ← une seule fois
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
