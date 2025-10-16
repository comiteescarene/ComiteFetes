"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PlanCanvas from "@/components/PlanCanvas";

type Props = {
  initialReserved?: string[];
};

export default function ReservationClient({ initialReserved = [] }: Props) {
  const router = useRouter();

  // sélection courante renvoyée par PlanCanvas
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // champs formulaire
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [esc, setEsc] = useState<"oui" | "non">("non");

  const per = esc === "oui" ? 5 : 10;
  const total = useMemo(() => per * Math.max(1, selected.length), [per, selected]);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) return;

    setSending(true);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        year: "2025",
        nom,
        prenom,
        tel,
        email,
        escarenois: esc === "oui",
        places: selected,
      }),
    });

    if (res.status === 409) {
      const { conflicts } = await res.json();
      alert(
        `Désolé, ces places viennent d'être prises: ${conflicts.join(", ")}.\nSélectionnez-en d'autres.`
      );
      setSending(false);
      setOpen(false);
      setSelected([]);
      router.refresh(); // recharge la page => les cases deviennent rouges
      return;
    }

    if (!res.ok) {
      setSending(false);
      alert("Erreur lors de l’enregistrement. Réessayez.");
      return;
    }

    const { id } = await res.json();
    setSending(false);
    setOpen(false);
    setSelected([]);
    router.refresh();
    alert(`Demande enregistrée (réf. ${id}). Vous recevrez un email de confirmation.`);
  }

  return (
    <div>
      <PlanCanvas
        reservedIds={initialReserved}
        onSubmit={(ids) => {
          setSelected(ids);
          setOpen(true);
        }}
      />

      {/* Modale */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleConfirm}
            className="w-[min(100%,36rem)] rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-semibold">Finaliser la réservation</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Places choisies :{" "}
              <span className="font-mono">{selected.join(", ") || "aucune"}</span>
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Prénom</label>
                <input
                  required
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Téléphone</label>
                <input
                  required
                  type="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium">Escarénois ?</label>
                <div className="mt-2 flex gap-6">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={esc === "oui"}
                      onChange={() => setEsc("oui")}
                    />
                    <span>Oui</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      checked={esc === "non"}
                      onChange={() => setEsc("non")}
                    />
                    <span>Non</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-md bg-neutral-50 p-3 text-sm">
              Tarif : {per}€ / emplacement • {selected.length} emplacement(s) →{" "}
              <b>Total {total}€</b>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border px-4 py-2"
                onClick={() => setOpen(false)}
              >
                Annuler
              </button>
              <button
                disabled={sending || selected.length === 0}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {sending ? "Envoi…" : "Valider la demande"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
