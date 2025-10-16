"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

const T_ESC = Number(process.env.NEXT_PUBLIC_TARIF_ESC ?? 5);
const T_EXT = Number(process.env.NEXT_PUBLIC_TARIF_EXT ?? 10);

export default function SelectionBar({ sel }: { sel: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [esc, setEsc] = useState((params.get("esc") ?? "0") === "1");

  useEffect(() => {
    // persiste le choix dans l'URL pour le partage
    const url = new URL(window.location.href);
    url.searchParams.set("esc", esc ? "1" : "0");
    history.replaceState({}, "", url.toString());
  }, [esc]);

  const total = useMemo(() => sel.length * (esc ? T_ESC : T_EXT), [sel, esc]);

  return (
    <div className="sticky bottom-4 z-10 mt-4 flex items-center justify-between rounded-xl border bg-white/95 p-3 shadow-lg backdrop-blur">
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded bg-neutral-100 px-2 py-1 font-semibold">{sel.length}</span>
        <span>place(s) sélectionnée(s)</span>
        <span className="text-neutral-400">•</span>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={esc} onChange={() => setEsc(!esc)} />
          Escarénois ?
        </label>
        <span className="text-neutral-400">•</span>
        <b>Total : {total.toFixed(2)} €</b>
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-lg border px-4 py-2"
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("places");
            history.replaceState({}, "", url.toString());
            window.dispatchEvent(new CustomEvent("clear-selection")); // on dira à PlanCanvas d'effacer
          }}
          disabled={!sel.length}
        >
          Tout effacer
        </button>
        <button
          className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white disabled:opacity-60"
          disabled={!sel.length}
          onClick={() =>
            router.push(`/reserver?places=${encodeURIComponent(sel.join(","))}&esc=${esc ? 1 : 0}`)
          }
        >
          Réserver
        </button>
      </div>
    </div>
  );
}
