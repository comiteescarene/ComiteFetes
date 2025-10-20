import { defineField, defineType } from "sanity";

export default defineType({
  name: "reservation",
  title: "Reservation",
  type: "document",
  fields: [
    defineField({ name: "year", type: "string" }),
    defineField({ name: "status", type: "string", options: { list: ["pending","confirmed","cancelled"] }, initialValue: "pending" }),
    defineField({ name: "nom", type: "string" }),
    defineField({ name: "prenom", type: "string" }),
    defineField({ name: "tel", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "escarenois", type: "boolean" }),
    defineField({ name: "places", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "count", type: "number" }),
    defineField({ name: "total", type: "number" }),
    defineField({ name: "createdAt", type: "datetime" }),
  ],
});
