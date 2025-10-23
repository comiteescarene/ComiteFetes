// sanity/schemas/types/event.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Évènement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {dateFormat: 'YYYY-MM-DD'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          {title: 'Brouillon', value: 'draft'},
          {title: 'En ligne', value: 'online'},
          {title: 'Clôturé', value: 'closed'},
          {title: 'Archivé', value: 'archived'},
        ],
        layout: 'radio',
      },
    }),

    // Associer un plan au besoin (adapte "marketMap" -> "plan" si ton type s’appelle autrement)
    defineField({
      name: 'plan',
      title: 'Plan Vide-grenier',
      type: 'reference',
      to: [{type: 'marketMap'}], // <--- ou {type: 'plan'} si c’est ce nom-là chez toi
    }),

    // Tarifs spécifiques à cet évènement (facultatif)
    defineField({
      name: 'tarifs',
      title: 'Tarifs (override)',
      type: 'object',
      fields: [
        defineField({
          name: 'escarenois',
          title: 'Escarénois',
          type: 'object',
          fields: [
            defineField({
              name: 'base1_3',
              title: '1 à 3 emplacements (€/place)',
              type: 'number',
              initialValue: 8,
            }),
            defineField({
              name: 'from4',
              title: 'À partir du 4e (€/place)',
              type: 'number',
              initialValue: 15,
            }),
          ],
        }),
        defineField({
          name: 'exterieur',
          title: 'Extérieur',
          type: 'object',
          fields: [
            defineField({
              name: 'base1_3',
              title: '1 à 3 emplacements (€/place)',
              type: 'number',
              initialValue: 18,
            }),
            defineField({
              name: 'from4',
              title: 'À partir du 4e (€/place)',
              type: 'number',
              initialValue: 18,
            }),
          ],
        }),
      ],
    }),
  ],
})
