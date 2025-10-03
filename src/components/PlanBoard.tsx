"use client";

import { useMemo, useState } from "react";
import type { PlanBlock, PlanColumn, Cell } from "@/data/planLayout";
import { useRouter } from "next/navigation";

const CELL = 48; // largeur/hauteur d’une case en px (ajuste 44/48/52 selon tes goûts)
const GAP = 8;   // écart entre cases

function CellView({
  cell,
  isSelected,
  isReserved,
  onClick,
}: {
  cell: Cell;
  isSelected: boolean;
  isReserved: boolean;
  onClick?: () => void;
}) {
  const base =
    "flex h-10 items-center justify-center rounded-md border text-xs font-semibold select-none";
  const w = { width: CELL, minWidth: CELL };

  if (typeof cell === "string") {
    const cls = isReserved
      ? "bg-red-100/70 text-red-700 border-red-300 line-through cursor-not-allowed"
      : isSelected
      ? "bg-emerald-600 text-white border-emerald-600 cursor-pointer"
      : "bg-white hover:bg-emerald-50 text-neutral-800 border-neutral-300 hover:border-emerald-400 cursor-pointer";
    return (
      <button type="button" onClick={onClick} className={`${base} ${cls}`} style={w} title={isReserved ? "Réservé" : "Libre"}>
        {cell}
      </button>
    );
  }

  if (cell.type === "label") {
    return (
      <div className={`${base} bg-neutral-100 text-neutral-600 border-neutral-200`} style={w}>
        {cell.text}
      </div>
    );
  }

  if (cell.type === "blocked") {
    return (
      <div className={`${base} bg-red-100/80 text-red-700 border-red-300 line-through`} style={w}>
        {cell.text}
      </div>
    );
  }

  // spacer (case vide pour faire un couloir)
  return <div style={{ width: CELL, height: 40 }} />;
}

export default function PlanBoard({
  rows,
  reserved,
}: {
  rows: PlanBlock[][];
  reserved: string[];
}) {
  const router = useRouter();
  const reservedSet = useMemo(() => new Set(reserved.map((s) => s.toUpperCase())), [reserved]);
  const [sel, setSel] = useState<string[]>([]);

  function toggle(id: string) {
    id = id.toUpperCase();
    if (reservedSet.has(id)) return;
    setSel((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  return (
    <>
      {rows.map((blocks, ri) => (
        <div key={ri} className="mt-6" style={{ display: "flex", flexWrap: "nowrap", gap: CELL }}>
          {blocks.map((block, bi) => (
            <section
              key={bi}
              style={{
                marginLeft: (block.offset ?? 0) * (CELL + GAP), // <<< DECALAGE HORIZONTAL EN CELLULES
                minWidth: block.minWidth ?? 0,
              }}
            >
              {block.title ? <h3 className="mb-2 text-sm font-semibold">{block.title}</h3> : null}

              <div style={{ display: "flex", gap: GAP }}>
                {block.columns.map((col: PlanColumn, ci: number) => (
                  <ul key={ci} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                    {col.map((cell, li) => {
                      const id = typeof cell === "string" ? cell : undefined;
                      const isReserved = !!(id && reservedSet.has(id));
                      const isSelected = !!(id && sel.includes(id));
                      return (
                        <li key={li}>
                          <CellView
                            cell={cell}
                            isReserved={isReserved}
                            isSelected={isSelected}
                            onClick={id ? () => toggle(id) : undefined}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
            </section>
          ))}
        </div>
      ))}

      <div className="sticky bottom-4 z-10 mt-8 flex items-center justify-between rounded-xl border bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="text-sm">
          Sélection : {sel.length ? <b>{sel.join(", ")}</b> : "aucune"}
        </div>
        <button
          onClick={() => sel.length && router.push(`/reserver?places=${encodeURIComponent(sel.join(","))}`)}
          disabled={!sel.length}
          className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white disabled:opacity-60"
        >
          Réserver {sel.length ? `${sel.length} emplacement(s)` : ""}
        </button>
      </div>
    </>
  );
}
