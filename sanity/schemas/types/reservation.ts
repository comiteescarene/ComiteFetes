import {defineType, defineField} from "sanity";

export default defineType({
  name: "reservation",
  title: "Réservation",
  type: "document",
  fields: [
    defineField({ name: "year", title: "Année", type: "string", initialValue: "2025" }),
    defineField({ name: "status", title: "Statut", type: "string",
      options: { list: ["pending","confirmed","cancelled"] }, initialValue: "pending" }),
    defineField({ name: "nom", type: "string", title: "Nom", validation: r => r.required() }),
    defineField({ name: "prenom", type: "string", title: "Prénom", validation: r => r.required() }),
    defineField({ name: "tel", type: "string", title: "Téléphone" }),
    defineField({ name: "email", type: "string", title: "Email", validation: r => r.required() }),
    defineField({ name: "escarenois", type: "boolean", title: "Escarénois ?" }),
    defineField({ name: "places", title: "Emplacements", type: "array", of: [{type:"string"}],
      validation: r => r.min(1) }),
    defineField({ name: "count", title: "Nb d’emplacements", type: "number" }),
    defineField({ name: "total", title: "Total (€)", type: "number" }),
    defineField({ name: "notes", title: "Notes orga", type: "text" }),
    // Option : fichiers (à brancher plus tard)
    // defineField({ name: "idCard", type: "file", title: "CNI" }),
    // defineField({ name: "proof", type: "file", title: "Justif. domicile" }),
  ],
});
