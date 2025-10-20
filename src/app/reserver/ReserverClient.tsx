"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type ReservationBody = {
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  escarenois: boolean;
  year: string;
  places: string[];
};

export default function ReserverClient() {
  const sp = useSearchParams();
  // accepte ?places=H1,G1 ou ?ids=H1,G1
  const places = useMemo(() => {
    const raw = sp.get("places") ?? sp.get("ids") ?? "";
    return raw.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
  }, [sp]);

  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (places.length === 0) {
      alert("Aucune place sélectionnée.");
      return;
    }
    setSending(true);

    const fd = new FormData(e.currentTarget);
    const body: ReservationBody = {
      nom: String(fd.get("nom") ?? ""),
      prenom: String(fd.get("prenom") ?? ""),
      tel: String(fd.get("tel") ?? ""),
      email: String(fd.get("email") ?? ""),
      escarenois: String(fd.get("escarenois") ?? "non") === "oui",
      year: "2025",
      places,
    };

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    let payload: any = {};
    try { payload = await res.json(); } catch {}

    if (res.status === 409) {
      alert(`Ces places viennent d'être prises : ${(payload.conflicts || []).join(", ")}.`);
      setSending(false);
      return;
    }
    if (!res.ok) {
      alert(payload?.error || "Erreur lors de l’enregistrement.");
      setSending(false);
      return;
    }

    alert("Réservation enregistrée ✅");
    setSending(false);
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <p className="text-sm text-neutral-600">
        Places choisies : {places.length ? places.join(", ") : "aucune"}
      </p>

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
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2" />
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
          disabled={sending || places.length === 0}
          className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {sending ? "Envoi…" : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
