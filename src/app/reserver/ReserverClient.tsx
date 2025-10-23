"use client";
import {useEffect, useMemo, useState} from "react";
import PlanCanvas from "@/components/PlanCanvas";

type EventDTO = {
  _id: string;
  title: string;
  date?: string;
  allowedPlaces?: string[];
  blockedPlaces?: string[];
};

export default function ReserverClient() {
  const [evt, setEvt] = useState<EventDTO|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string| null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/events/current");
      const js = await res.json();
      if (!res.ok || !js.ok) { setError(js.error || "Aucun évènement en ligne"); setEvt(null); setLoading(false); return; }
      setEvt(js.event);
      setLoading(false);
    })();
  }, []);

  const reservedSet = useMemo(() => new Set<string>(), []); // tu peux précharger si tu veux

  if (loading) return <p>Chargement…</p>;
  if (error || !evt) return <p className="text-red-600">{error ?? "Aucun évènement en ligne"}</p>;

  const allowed = new Set((evt.allowedPlaces || []).map(s => s.toUpperCase()));
  const blocked = new Set((evt.blockedPlaces || []).map(s => s.toUpperCase()));

  const onSubmit = async (ids: string[]) => {
    if (!ids.length) return;
    setSelected(ids);
    const fd = {
      places: ids,
      nom:  (document.getElementById("nom") as HTMLInputElement)?.value || "",
      prenom: (document.getElementById("prenom") as HTMLInputElement)?.value || "",
      tel: (document.getElementById("tel") as HTMLInputElement)?.value || "",
      email: (document.getElementById("email") as HTMLInputElement)?.value || "",
      escarenois: (document.querySelector<HTMLInputElement>('input[name="esc"]:checked')?.value === "oui"),
    };
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(fd),
    });
    const js = await res.json();
    if (!res.ok || !js.ok) { alert(js.error || "Erreur lors de l’enregistrement."); return; }
    alert("Réservation enregistrée !");
  };

  return (
    <div>
      <div className="rounded-xl border p-3 mb-4 bg-white">
        <div className="text-sm text-neutral-600">Évènement en ligne :</div>
        <div className="font-semibold">{evt.title} {evt.date ? `— ${new Date(evt.date).toLocaleDateString("fr-FR")}` : ""}</div>
      </div>

      <PlanCanvas
        reservedIds={reservedSet}
        onSubmit={onSubmit}
        // si tu veux limiter à allowed, passe allowed/blocked en props et bloque côté component
      />

      {/* mini formulaire (à remplacer par le tien) */}
      <form className="mt-6 grid gap-3">
        <input id="nom" placeholder="Nom" className="border p-2 rounded"/>
        <input id="prenom" placeholder="Prénom" className="border p-2 rounded"/>
        <input id="tel" placeholder="Téléphone" className="border p-2 rounded"/>
        <input id="email" placeholder="Email" className="border p-2 rounded"/>
        <div className="flex items-center gap-4">
          <label><input type="radio" name="esc" value="oui" /> Escarénois</label>
          <label><input type="radio" name="esc" value="non" defaultChecked /> Extérieur</label>
        </div>
      </form>
    </div>
  );
}
