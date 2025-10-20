import { sanityClient } from "../../../../sanity/client";
import { groq } from "next-sanity";
import AdminReservationsTable from "./AdminReservationsTable";
import type { Reservation } from "@/types/reservation"; // ⬅️ ici

export const dynamic = "force-dynamic";

const Q = groq`*[_type=="reservation"]|order(createdAt desc){
  _id, year, status, nom, prenom, tel, email, escarenois, places, count, total, createdAt
}`;

export default async function Page() {
  const items = await sanityClient.fetch<Reservation[]>(Q);
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Réservations</h1>
      <p className="mt-1 text-neutral-600">
        Valide ou annule les demandes. Le plan se mettra à jour automatiquement.
      </p>
      <div className="mt-6">
        <AdminReservationsTable initial={items} />
      </div>
    </main>
  );
}
