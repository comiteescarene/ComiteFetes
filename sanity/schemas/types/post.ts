import {defineType, defineField} from "sanity";
export default defineType({
  name: "post",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title",   title: "Titre",   type: "string" }),
    defineField({ name: "slug",    title: "Slug",    type: "slug", options: { source: "title" } }),
    defineField({ name: "excerpt", title: "Chapeau", type: "text" }),
    defineField({ name: "body",    title: "Contenu", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "date",    title: "Date",    type: "datetime" }),
  ],
  orderings: [{ name:"dateDesc", title:"Date desc", by:[{field:"date",direction:"desc"}]}],
});
