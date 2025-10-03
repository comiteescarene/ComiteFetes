"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const TARIF_ESC = 5;
const TARIF_EXT = 10;

export default function Reserver() {
  const sp = useSearchParams();
  const places = (sp.get("places") || "").split(",").filter(Boolean);
  const [esc, setEsc] = useState("oui");
  const price = useMemo(() =>
    (esc==="oui" ? TARIF_ESC : TARIF_EXT) * Math.max(1, places.length), [esc, places.length]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    payload.places = places;
    payload.year   = "2025";
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 409) {
      const data = await res.json();
      alert("Désolé, ces places ne sont plus disponibles : " + data.conflicts.join(", "));
      return;
    }
    if (!res.ok) { alert("Erreur. Réessaie plus tard."); return; }
    alert("Demande envoyée ! Nous revenons vers vous par email.");
    window.location.href = "/videgrenier";
  }

  return (
    <main className="max-w-2xl">
      <h1 className="text-2xl font-bold">Réserver {places.length} emplacement(s)</h1>
      <p className="mt-2 text-neutral-600">Sélection : {places.join(", ")}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="block text-sm font-medium">Nom</label>
            <input name="nom" required className="mt-1 w-full rounded-lg border px-3 py-2" /></div>
          <div><label className="block text-sm font-medium">Prénom</label>
            <input name="prenom" required className="mt-1 w-full rounded-lg border px-3 py-2" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="block text-sm font-medium">Téléphone</label>
            <input name="tel" className="mt-1 w-full rounded-lg border px-3 py-2" /></div>
          <div><label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" required className="mt-1 w-full rounded-lg border px-3 py-2" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium">Escarénois ?</label>
          <select name="escarenois" value={esc} onChange={(e)=>setEsc(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2">
            <option value="oui">Oui</option><option value="non">Non</option>
          </select>
        </div>

        <div className="rounded-lg border p-3 text-sm">
          Total estimé : <b>{price} €</b> ({esc==="oui" ? TARIF_ESC : TARIF_EXT} €/place)
        </div>

        <button className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white">
          Envoyer la demande
        </button>
      </form>
    </main>
  );
}
