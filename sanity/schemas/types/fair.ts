// sanity/schemas/types/fair.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'fair',
  title: 'Vide-grenier',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'date',  title: 'Date',  type: 'date', options: {dateFormat: 'YYYY-MM-DD'}, validation: r => r.required() }),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug',
      options: { source: (doc:any) => `${doc.date || ''}-${(doc.title||'').toLowerCase().replace(/\s+/g,'-')}`, maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({
      name: 'status', title: 'Statut', type: 'string', initialValue: 'open',
      options: { list: [
        {title:'Ouvert (réservations autorisées)', value:'open'},
        {title:'Fermé (réservations bloquées)',   value:'closed'},
        {title:'Archivé',                         value:'archived'},
      ] }
    }),
    defineField({ name: 'priceEscarenois', title: 'Tarif Escarénois (€)', type: 'number', initialValue: 5 }),
    defineField({ name: 'priceOther',      title: 'Tarif Extérieur (€)',  type: 'number', initialValue: 10 }),
    defineField({
      name: 'planJson', title: 'Plan (JSON)', type: 'text',
      description: 'Collez ici le JSON du plan (PLAN_ITEMS).',
    }),
  ],
  preview: {
    select: { title:'title', date:'date', status:'status' },
    prepare({title, date, status}) {
      const st = status==='open'?'🟢 Ouvert':status==='closed'?'🟡 Fermé':'🗄️ Archivé'
      return { title: title||'Vide-grenier', subtitle: `${date ?? ''} • ${st}` }
    }
  },
})
