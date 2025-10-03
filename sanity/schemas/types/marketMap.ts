import {defineType, defineField} from "sanity";

export default defineType({
  name: "marketMap",
  title: "Plan Vide-grenier",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Année (ou édition)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "reserved",
      title: "Emplacements réservés",
      type: "array",
      of: [{ type: "string" }],
      description: "Ex: A1, A2, B14, C23…",
    }),
  ],
});
