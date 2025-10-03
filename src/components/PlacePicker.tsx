"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlacePicker({
  allPlaces, reserved,
}: { allPlaces: string[]; reserved: string[] }) {
  const router = useRouter();
  const reservedSet = new Set(reserved.map(s => s.toUpperCase()));
  const [sel, setSel] = useState<string[]>([]);

  function toggle(id: string) {
    if (reservedSet.has(id)) return;
    setSel((prev) => prev.includes(id) ? prev.filter(p => p!==id) : [...prev, id]);
  }

  return (
    <>
      <div className="grid grid-cols-8 gap-3 sm:grid-cols-10 lg:grid-cols-12">
        {allPlaces.map(id => {
          const isRes = reservedSet.has(id);
          const isSel = sel.includes(id);
          const base = "flex h-12 items-center justify-center rounded-lg border text-sm font-semibold";
          const cls = isRes
            ? "bg-red-100/70 text-red-700 border-red-300 line-through cursor-not-allowed"
            : isSel
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white hover:bg-emerald-50 text-neutral-800 border-neutral-300 hover:border-emerald-400 cursor-pointer";
          return (
            <button key={id} type="button" onClick={() => toggle(id)}
              className={`${base} ${cls}`} aria-disabled={isRes}>
              {id}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-neutral-600">
          Sélection : {sel.length ? sel.join(", ") : "aucune"}.
        </div>
        <button
          disabled={!sel.length}
          onClick={() => router.push(`/reserver?places=${sel.join(",")}`)}
          className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white disabled:opacity-60">
          Réserver {sel.length} emplacement{sel.length>1?"s":""}
        </button>
      </div>
    </>
  );
}
