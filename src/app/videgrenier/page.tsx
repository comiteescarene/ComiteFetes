// src/app/videgrenier/page.tsx
import { PLAN_ITEMS } from "@/data/planCanvas";
import PlanCanvas from "@/components/PlanCanvas";

// ▼ Si tu as un client Sanity (sanity/client.ts) décommente :
// import { sanityClient } from "@/../sanity/client";
// import { groq } from "next-sanity";

const YEAR = "2025";

async function getReserved(): Promise<string[]> {
  // ▼ Version Sanity (décommente si prêt) :
  // const q = groq`*[_type=="reservation" && year==$year && status in ["pending","confirmed"]].places[]`;
  // const arr = await sanityClient.fetch<string[]>(q, { year: YEAR });
  // return (arr || []).map(s => s.toUpperCase());

  // ▼ Sinon, pas de réservations au chargement :
  return [];
}

export default async function VideGrenierPage() {
  const reserved = await getReserved();
  return (
    <main className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold">Vide-grenier {YEAR}</h1>
      <p className="mt-2 text-neutral-600">
        Cliquez sur une ou plusieurs cases libres, puis « Réserver ».
      </p>
      <div className="mt-6">
        <PlanCanvas items={PLAN_ITEMS} reserved={reserved} />
      </div>
    </main>
  );
}
