import {defineType, defineField} from "sanity";
export default defineType({
  name: "home",
  title: "Accueil",
  type: "document",
  fields: [
    defineField({ name: "heroTitle",    title: "Titre hero",        type: "string" }),
    defineField({ name: "heroSubtitle", title: "Sous-titre hero",   type: "text" }),
    defineField({ name: "nextEvent",    title: "Prochain évènement",type: "string" }),
    defineField({
      name: "infos", title: "Infos pratiques",
      type: "array", of: [{ type: "reference", to: [{ type: "infoTile" }] }]
    }),
  ],
});
