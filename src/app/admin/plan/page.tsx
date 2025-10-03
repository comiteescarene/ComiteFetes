import { sanityClient } from "../../../../sanity/client";
import { groq } from "next-sanity";
import { ALL_PLACES } from "@/data/places";
import Link from "next/link";

const YEAR = "2025";

type Res = {
  _id: string; status: string; nom: string; prenom: string; email: string;
  escarenois: boolean; places: string[]; total: number;
};

async function getData() {
  const q = groq`*[_type=="reservation" && year==$year]{
    _id,status,nom,prenom,email,escarenois,places,total
  } | order(_createdAt desc)`;
  const rows: Res[] = await sanityClient.fetch(q, { year: YEAR });
  const reserved = new Set(rows.filter(r => ["pending","confirmed"].includes(r.status))
                               .flatMap(r => r.places.map(p=>p.toUpperCase())));
  return { rows, reserved };
}

export default async function AdminPlan() {
  const { rows, reserved } = await getData();

  return (
    <main className="max-w-6xl">
      <h1 className="text-2xl font-bold">Plan & réservations {YEAR}</h1>

      <div className="mt-6 grid grid-cols-8 gap-2 sm:grid-cols-10 lg:grid-cols-12">
        {ALL_PLACES.map(id => {
          const taken = reserved.has(id.toUpperCase());
          const cls = taken
            ? "bg-red-100 text-red-700 border-red-300 line-through"
            : "bg-white";
          return (
            <div key={id}
              className={`flex h-10 items-center justify-center rounded border text-sm ${cls}`}>
              {id}
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 text-xl font-semibold">Réservations</h2>
      <div className="mt-3 overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-3 py-2 text-left">Statut</th>
              <th className="px-3 py-2 text-left">Nom</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Places</th>
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id} className="border-t">
                <td className="px-3 py-2">{r.status}</td>
                <td className="px-3 py-2">{r.prenom} {r.nom}</td>
                <td className="px-3 py-2"><a className="text-emerald-700" href={`mailto:${r.email}`}>{r.email}</a></td>
                <td className="px-3 py-2">{r.places.join(", ")}</td>
                <td className="px-3 py-2 text-right">{r.total} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        Astuce : dans Sanity Studio, tu peux passer une réservation à <b>confirmed</b> quand le paiement est reçu,
        ou <b>cancelled</b> pour libérer les places.
      </p>
    </main>
  );
}
