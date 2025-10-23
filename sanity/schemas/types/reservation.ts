import {defineType, defineField} from "sanity";

export default defineType({
  name: "reservation",
  title: "Réservation",
  type: "document",
  fields: [
    // 🔴 NOUVEAU : lien obligatoire vers l’évènement
    defineField({
      name: "event",
      title: "Évènement",
      type: "reference",
      to: [{type: "event"}],
      validation: r => r.required(),
    }),

    defineField({ name: "year", title: "Année (facultatif)", type: "string" }),

    defineField({ name: "status", title: "Statut", type: "string", options: {
      list: [{title:"En attente", value:"pending"}, {title:"Confirmée", value:"confirmed"}],
    }, initialValue: "pending" }),

    defineField({ name: "nom", title: "Nom", type: "string", validation:r=>r.required() }),
    defineField({ name: "prenom", title: "Prénom", type: "string", validation:r=>r.required() }),
    defineField({ name: "tel", title: "Téléphone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string", validation:r=>r.required() }),

    defineField({ name: "escarenois", title: "Escarénois ?", type: "boolean" }),

    defineField({ name: "places", title: "Places", type: "array", of: [{type:"string"}], validation:r=>r.min(1) }),
    defineField({ name: "count", title: "Nb places", type: "number" }),
    defineField({ name: "total", title: "Total €", type: "number" }),

    // paiement (si tu as déjà ajouté ces champs)
    defineField({ name: "paid", title: "Payé ?", type: "boolean", initialValue: false }),
    defineField({
      name: "payment",
      title: "Règlement",
      type: "object",
      fields: [
        { name:"method", title:"Moyen", type:"string", options:{ list:[
          {title:"Espèces", value:"cash"},
          {title:"Chèque", value:"cheque"},
          {title:"CB", value:"card"},
        ]}},
        { name:"bank", title:"Banque (si chèque)", type:"string" },
        { name:"chequeNumber", title:"N° chèque", type:"string" },
      ]
    }),
  ],
});
