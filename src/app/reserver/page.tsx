import { Suspense } from "react";
import ReserverClient from "./ReserverClient";

export const dynamic = "force-dynamic"; // évite d'autres soucis de prerender

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Réserver</h1>
      <p className="mt-1 text-neutral-600">
        Choisissez vos emplacements puis remplissez le formulaire.
      </p>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="rounded-xl border bg-white p-4 text-sm text-neutral-600">
              Chargement…
            </div>
          }
        >
          <ReserverClient />
        </Suspense>
      </div>
    </main>
  );
}
