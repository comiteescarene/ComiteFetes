import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import schemas from "./schemas";

// Le Studio tourne dans le navigateur ⇒ on lit les variables NEXT_PUBLIC_ :
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? process.env.SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_PROJECT_ID) in environment");
}

export default defineConfig({
  name: "default",
  title: "Comité des Fêtes",
  projectId,
  dataset,
  plugins: [
    deskTool(),   // 👈 éditeur de contenu
    visionTool(), // console GROQ (facultatif)
  ],
  schema: { types: schemas },
});
