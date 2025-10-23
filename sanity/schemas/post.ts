// sanity/schemas/post.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Actualité',
  type: 'document',
  fields: [
    defineField({ name: 'title',   title: 'Titre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',    title: 'Slug',  type: 'slug', options: {source: 'title'} }),
    defineField({ name: 'date',    title: 'Date',  type: 'datetime' }),
    defineField({ name: 'excerpt', title: 'Résumé', type: 'text' }),
  ],
})
