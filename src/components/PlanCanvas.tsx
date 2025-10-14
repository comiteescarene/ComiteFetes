// src/components/PlanCanvas.tsx
"use client";

import { useMemo, useState } from "react";
import type { PlanItem, PositionedMatrix, PositionedLabel, Cell } from "@/data/planCanvas";
import { useRouter } from "next/navigation";

const CELL_W = 48;  // largeur d'une case (px)
const CELL_H = 32;  // hauteur
const GAP    = 6;   // espacement

function cellBase() {
  return "flex h-[32px] w-[48px] items-center justify-center rounded-md border text-sm font-semibold select-none";
}

function CellView({
  cell, isSelected, isReserved, onClick,
}: { cell: Cell; isSelected: boolean; isReserved: boolean; onClick?: () => void }) {
  if (typeof cell === "string") {
    const cls = isReserved
      ? "bg-red-100/70 text-red-700 border-red-300 line-through cursor-not-allowed"
      : isSelected
        ? "bg-emerald-600 text-white border-emerald-600 cursor-pointer"
        : "bg-white hover:bg-emerald-50 text-neutral-800 border-neutral-300 hover:border-emerald-400 cursor-pointer";
    return (
      <button type="button" className={`${cellBase()} ${cls}`} onClick={onClick} title={isReserved ? "Réservé" : "Libre"}>
        {cell}
      </button>
    );
  }
  if (cell.type === "label") {
    const w = cell.w ?? 2;
    const width = w*CELL_W + (w-1)*GAP;
    return (
      <div
        className="flex items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-neutral-700 text-sm font-semibold"
        style={{ width, height: CELL_H }}
      >
        {cell.text}
      </div>
    );
  }
  return null;
}

function MatrixBlock({ block, reservedSet, sel, toggle }: {
  block: PositionedMatrix; reservedSet: Set<string>;
  sel: string[]; toggle: (id: string) => void;
}) {
  const top  = (block.y - 1) * (CELL_H + GAP);
  const left = (block.x - 1) * (CELL_W + GAP);

  return (
    <section className="absolute" style={{ top, left }}>
      {block.title ? <h3 className="mb-2 text-xs font-semibold text-neutral-600">{block.title}</h3> : null}
      <div className="flex gap-2">
        {block.columns.map((col, ci) => (
          <ul key={ci} className="flex flex-col gap-2">
            {col.map((cell, li) => {
              const id = typeof cell === "string" ? cell.toUpperCase() : undefined;
              const isRes = !!(id && reservedSet.has(id));
              const isSel = !!(id && sel.includes(id));
              return (
                <li key={li}>
                  <CellView
                    cell={cell}
                    isReserved={isRes}
                    isSelected={isSel}
                    onClick={id ? () => toggle(id) : undefined}
                  />
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </section>
  );
}

function LabelBlock({ block }: { block: PositionedLabel }) {
  const top  = (block.y - 1) * (CELL_H + GAP);
  const left = (block.x - 1) * (CELL_W + GAP);
  return (
    <div className="absolute" style={{ top, left }}>
      <CellView cell={{ type: "label", text: block.text, w: block.w }} isSelected={false} isReserved={false} />
    </div>
  );
}

export default function PlanCanvas({ items, reserved }: { items: PlanItem[]; reserved: string[] }) {
  const router = useRouter();
  const reservedSet = useMemo(() => new Set(reserved.map(s => s.toUpperCase())), [reserved]);
  const [sel, setSel] = useState<string[]>([]);

  function toggle(id: string) {
    id = id.toUpperCase();
    if (reservedSet.has(id)) return;
    setSel(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }

  const maxX = useMemo(() => {
    let m = 35;
    for (const it of items) m = Math.max(m, (it.type === "matrix") ? it.x + it.columns.length + 2 : it.x + it.w + 1);
    return m;
  }, [items]);

  const maxY = useMemo(() => {
    let m = 50;
    for (const it of items) {
      if (it.type === "matrix") {
        const h = Math.max(...it.columns.map(c => c.length));
        m = Math.max(m, it.y + h + 2);
      } else m = Math.max(m, it.y + 2);
    }
    return m;
  }, [items]);

  return (
    <>
      <div
        className="relative rounded-xl border bg-white p-4"
        style={{
          width:  maxX * (CELL_W + GAP),
          height: maxY * (CELL_H + GAP),
          minWidth: "100%",
          overflow: "auto",
        }}
      >
        {items.map((it, idx) =>
          it.type === "matrix" ? (
            <MatrixBlock key={idx} block={it} reservedSet={reservedSet} sel={sel} toggle={toggle} />
          ) : (
            <LabelBlock key={idx} block={it} />
          )
        )}
      </div>

      <div className="sticky bottom-4 z-10 mt-4 flex items-center justify-between rounded-xl border bg-white/90 p-3 shadow-lg backdrop-blur">
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
