"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type ReservationBody = {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  escarenois: boolean;
  year: string;         // "2025"
  places: string[];     // ex: ["H1","G1"]
};

export default function ReserverPage() {
  const sp = useSearchParams();

  // ex: /reserver?ids=H1,G1
  const places = useMemo(
    () =>
      (sp.get("ids") ?? "")
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
    [sp]
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<
      string,
      FormDataEntryValue
    >;

    // Construire un vrai payload JSON typé
    const body: ReservationBody = {
      nom: String(raw.nom ?? ""),
      prenom: String(raw.prenom ?? ""),
      tel: String(raw.tel ?? ""),
      email: String(raw.email ?? ""),
      escarenois: String(raw.escarenois ?? "non") === "oui",
      year: "2025",
      places,
    };

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Erreur lors de l’enregistrement. Réessayez.");
      return;
    }

    const data = await res.json();
    // TODO: rediriger / afficher succès
    alert(`Réservation enregistrée. Id: ${data.id ?? "?"}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">Finaliser la réservation</h1>
      <p className="mt-1 text-neutral-600">
        Places choisies : {places.length ? places.join(", ") : "aucune"}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm">Nom</span>
            <input name="nom" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm">Prénom</span>
            <input name="prenom" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm">Téléphone</span>
            <input name="tel" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="block">
            <span className="text-sm">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
        </div>

        <fieldset className="mt-2">
          <legend className="text-sm mb-1">Escarénois ?</legend>
          <label className="mr-4 inline-flex items-center gap-2">
            <input type="radio" name="escarenois" value="oui" /> Oui
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="escarenois" value="non" defaultChecked /> Non
          </label>
        </fieldset>

        <div className="pt-2">
          <button
            type="submit"
            disabled={places.length === 0}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
          >
            Envoyer
          </button>
        </div>
      </form>
    </main>
  );
}
