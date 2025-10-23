// sanity/schemas/types/reservation.ts
import {defineType, defineField} from "sanity";

export default defineType({
  name: "reservation",
  title: "Réservation",
  type: "document",
  fields: [
    defineField({ name: "year", type: "string", initialValue: "2025" }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          {title: "En attente", value: "pending"},
          {title: "Confirmée",  value: "confirmed"},
        ],
      },
      initialValue: "pending",
    }),
    defineField({ name: "nom",        type: "string" }),
    defineField({ name: "prenom",     type: "string" }),
    defineField({ name: "tel",        type: "string" }),
    defineField({ name: "email",      type: "string" }),
    defineField({ name: "escarenois", type: "boolean" }),
    defineField({ name: "places",     type: "array", of: [{type: "string"}] }),
    defineField({ name: "count",      type: "number" }),
    defineField({ name: "total",      type: "number" }),
    defineField({ name: "createdAt",  type: "datetime", initialValue: () => new Date().toISOString() }),
  ],
});
