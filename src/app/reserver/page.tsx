export const dynamic = "force-dynamic"; // pas de SSG ici

import ReservationClient from "./ReserverClient";

export default function ReserverPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Réserver</h1>
      <p className="mt-1 text-neutral-600">
        Sélectionnez vos emplacements puis remplissez le formulaire.
      </p>
      <div className="mt-6">
        <ReservationClient />
      </div>
    </main>
  );
}
