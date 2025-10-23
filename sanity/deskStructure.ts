// sanity/deskStructure.ts
import type { StructureResolver } from "sanity/desk";

const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu")
    .items([
      // ─── Évènements ───────────────────────────────────────────────────────────
      S.listItem()
        .title("Évènements")
        .child(
          // 1) Liste de tous les documents de type "event"
          S.documentTypeList("event")
            .title("Tous les évènements")
            // 2) Quand on clique un évènement, on affiche ses sous-listes de réservations
            .child((eventId: string) =>
              S.list()
                .title("Réservations")
                .items([
                  // Toutes
                  S.listItem()
                    .title("Toutes")
                    .child(
                      S.documentList()
                        .title("Toutes")
                        .filter('_type == "reservation" && references($eventId)')
                        .params({ eventId })
                        .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                    ),

                  // En attente
                  S.listItem()
                    .title("En attente")
                    .child(
                      S.documentList()
                        .title("En attente")
                        .filter('_type == "reservation" && status == "pending" && references($eventId)')
                        .params({ eventId })
                        .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                    ),

                  // Confirmées
                  S.listItem()
                    .title("Confirmées")
                    .child(
                      S.documentList()
                        .title("Confirmées")
                        .filter('_type == "reservation" && status == "confirmed" && references($eventId)')
                        .params({ eventId })
                        .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                    ),

                  // À encaisser (on tolère soit "paid" à la racine, soit payment.paid si tu l'utilises)
                  S.listItem()
                    .title("À encaisser")
                    .child(
                      S.documentList()
                        .title("À encaisser")
                        .filter('_type == "reservation" && references($eventId) && coalesce(paid, payment.paid) != true')
                        .params({ eventId })
                        .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                    ),

                  // Payé
                  S.listItem()
                    .title("Payé")
                    .child(
                      S.documentList()
                        .title("Payé")
                        .filter('_type == "reservation" && references($eventId) && coalesce(paid, payment.paid) == true')
                        .params({ eventId })
                        .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                    ),
                ])
            )
        ),

      S.divider(),

      // Actualités
      S.documentTypeListItem("post").title("Actualités"),
    ]);

export default structure;