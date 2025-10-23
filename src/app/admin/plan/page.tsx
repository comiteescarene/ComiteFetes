// src/app/admin/plan/page.tsx
import { sanityClient } from "../../../../sanity/client";
import { groq } from "next-sanity";
import PlanCanvas from "@/components/PlanCanvas";
import AdminActions from "./AdminActions";

export const dynamic = "force-dynamic"; // données fraîches à chaque fois

type Reservation = {
  _id: string;
  _createdAt: string;
  status: "pending" | "confirmed" | "cancelled";
  nom: string;
  prenom: string;
  email?: string;
  tel?: string;
  escarenois?: boolean;
  places: string[];
  total?: number;
};

export default async function AdminPlanPage({
  searchParams,
}: {
  searchParams?: { year?: string; status?: string };
}) {
  const year = searchParams?.year || "2025";
  const statuses = (searchParams?.status || "pending,confirmed")
    .split(",")
    .map((s) => s.trim());

  const query = groq`*[_type=="reservation" && year==$year && status in $statuses]{
    _id,_createdAt,status,nom,prenom,email,tel,escarenois,places,total
  }|order(_createdAt desc)`;

  const reservations: Reservation[] = await sanityClient.fetch(query, {
    year,
    statuses,
  });

  // 1) places déjà prises (pour PlanCanvas)
  const reservedIds = new Set(
    reservations.flatMap((r) => (r.places || []).map((p) => p.toUpperCase()))
  );

  // 2) meta par place -> pour afficher "Occupé par Nom"
  const reservedMeta = Object.fromEntries(
    reservations.flatMap((r) =>
      (r.places || []).map((p) => [
        p.toUpperCase(),
        { by: `${r.prenom} ${r.nom}`, status: r.status },
      ])
    )
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin — Plan</h1>
          <p className="text-sm text-neutral-600">
            Réservations {year} • filtres status: {statuses.join(", ")}
          </p>
        </div>
        <form className="flex gap-2">
          <input
            name="year"
            defaultValue={year}
            className="rounded-md border px-2 py-1 text-sm"
            placeholder="Année"
          />
          <input
            name="status"
            defaultValue={statuses.join(",")}
            className="rounded-md border px-2 py-1 text-sm"
            placeholder="pending,confirmed"
          />
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50">
            Filtrer
          </button>
        </form>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <PlanCanvas
          reservedIds={reservedIds}
          // Optionnel : si tu ajoutes reservedMeta dans PlanCanvas (voir section 4)
          // @ts-expect-error – prop optionnelle
          reservedMeta={reservedMeta}
          onSubmit={() => {}}
        />
      </div>

      <h2 className="mt-8 text-xl font-semibold">Réservations</h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Coordonnées</th>
              <th className="px-3 py-2">Places</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">
                  {new Date(r._createdAt).toLocaleString("fr-FR")}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{r.prenom} {r.nom}</div>
                  <div className="text-xs text-neutral-500">
                    {r.escarenois ? "Escarénois" : "Extérieur"}
                  </div>
                </td>
                <td className="px-3 py-2 text-xs">
                  <div>{r.email}</div>
                  <div>{r.tel}</div>
                </td>
                <td className="px-3 py-2">{r.places?.join(", ")}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs " +
                      (r.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : r.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-200 text-neutral-700")
                    }
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <AdminActions id={r._id} status={r.status} />
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-neutral-500" colSpan={6}>
                  Aucune réservation pour ces filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
