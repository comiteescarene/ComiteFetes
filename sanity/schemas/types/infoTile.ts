import {defineType, defineField} from "sanity";
export default defineType({
  name: "infoTile",
  title: "Info pratique",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre",       type: "string" }),
    defineField({ name: "desc",  title: "Description", type: "text" }),
    defineField({ name: "href",  title: "Lien",        type: "string" }),
  ],
});
