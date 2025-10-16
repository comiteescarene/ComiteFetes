"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import type { PlanItem, PositionedLabel, PositionedMatrix, Cell } from "@/data/planCanvas";
import { PLAN_ITEMS } from "@/data/planCanvas";
import clsx from "clsx";

type Props = {
  /** Identifiants déjà réservés (ex: "B3", "C10", "F14") */
  reservedIds?: Set<string> | string[];
  /** Soumission de la sélection */
  onSubmit?: (ids: string[]) => void;
};

const CELL = 36; // taille d'une case en px
const GAP  = 8;  // espacement en px
const MAX_COLS = 36; // marge large pour la grille
const MAX_ROWS = 48;

export default function PlanCanvas({ reservedIds, onSubmit }: Props) {
  // normaliser reservedIds en Set
  const reserved = useMemo(
    () => new Set(Array.isArray(reservedIds) ? reservedIds : reservedIds ? Array.from(reservedIds) : []),
    [reservedIds]
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [scale, setScale]       = useState(1); // zoom
  const regionRef               = useRef<HTMLDivElement>(null);

  // annonce ARIA du nombre de places sélectionnées
  const [ariaMessage, setAriaMessage] = useState("");
  useEffect(() => {
    const n = selected.size;
    setAriaMessage(n === 0 ? "Aucune place sélectionnée" : `${n} place${n > 1 ? "s" : ""} sélectionnée${n > 1 ? "s" : ""}`);
  }, [selected]);

  const toggle = (id: string) => {
    if (reserved.has(id)) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clear = () => setSelected(new Set());
  const zoomIn  = () => setScale(s => Math.min(1.6, +(s + 0.1).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.8, +(s - 0.1).toFixed(2)));
  const zoomReset = () => setScale(1);

  const handleSubmit = () => onSubmit?.(Array.from(selected));

  // navigation clavier basique (flèches) : on mémorise le dernier focus
  const lastFocus = useRef<HTMLButtonElement | null>(null);
  const onCellKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, x: number, y: number) => {
    if (!regionRef.current) return;
    const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] } as const;
    const mov = (dir as any)[e.key];
    if (!mov) return;

    e.preventDefault();
    const [dx, dy] = mov;
    // on cherche le prochain button [data-x][data-y] dans la direction
    const next = regionRef.current.querySelector<HTMLButtonElement>(
      `button[data-x="${x + dx}"][data-y="${y + dy}"]`
    );
    if (next) {
      next.focus();
      lastFocus.current = next;
    }
  };

  return (
    <div className="relative">
      {/* Légende + outils */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Legend />
        <div className="flex items-center gap-1">
          <button onClick={zoomOut} className="rounded-md border px-2 py-1 text-sm hover:bg-neutral-50">−</button>
          <button onClick={zoomReset} className="rounded-md border px-2 py-1 text-sm hover:bg-neutral-50">100%</button>
          <button onClick={zoomIn} className="rounded-md border px-2 py-1 text-sm hover:bg-neutral-50">+</button>
        </div>
      </div>

      {/* Zone scrollable + zoom */}
      <div className="relative max-h-[70vh] overflow-auto rounded-2xl border bg-white/60 p-4 shadow-sm">
        <div
          className="origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Grille CSS (colonnes/lignes) */}
          <div
            ref={regionRef}
            role="grid"
            aria-label="Plan des emplacements"
            className="relative"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${MAX_COLS}, ${CELL}px)`,
              gridTemplateRows: `repeat(${MAX_ROWS}, ${CELL}px)`,
              gap: `${GAP}px`,
              // fond “papier millimétré” discret
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.03) 1px, transparent 1px)",
              backgroundSize: `${CELL + GAP}px ${CELL + GAP}px`,
            }}
          >
            {PLAN_ITEMS.map((item, idx) => {
              if (item.type === "label") {
                const lab = item as PositionedLabel;
                return (
                  <div
                    key={`label-${idx}-${lab.x}-${lab.y}`}
                    className="pointer-events-none select-none rounded-xl border bg-neutral-100/80 text-center text-xs italic text-neutral-600"
                    style={{
                      gridColumnStart: lab.x,
                      gridRowStart: lab.y,
                      gridColumnEnd: `span ${lab.w}`,
                      gridRowEnd: "span 1",
                      padding: 6,
                    }}
                  >
                    {lab.text}
                  </div>
                );
              }

              const mat = item as PositionedMatrix;
              return (
                <Matrix
                  key={`matrix-${idx}-${mat.x}-${mat.y}`}
                  mat={mat}
                  reserved={reserved}
                  selected={selected}
                  onToggle={toggle}
                  onKeyDown={onCellKeyDown}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Barre sticky d’action */}
      <div className="sticky bottom-3 mt-4">
        <div className="flex items-center justify-between rounded-2xl border bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs">
              {selected.size} sélectionnée{selected.size > 1 ? "s" : ""}
            </span>
            <button
              onClick={clear}
              disabled={selected.size === 0}
              className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50 disabled:opacity-40"
            >
              Tout effacer
            </button>
            <span className="sr-only" aria-live="polite">{ariaMessage}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className={clsx(
              "rounded-lg px-4 py-2 text-sm font-medium shadow-sm",
              selected.size === 0
                ? "bg-emerald-600/40 text-white/70 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
          >
            Réserver {selected.size > 0 ? `(${selected.size})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------- Sous-composants ----------- */

function Legend() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-4 w-6 rounded-md border bg-white" /> Libre
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-4 w-6 rounded-md border bg-neutral-200" /> Occupé
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-4 w-6 rounded-md border bg-emerald-600" /> Ma sélection
      </span>
    </div>
  );
}

function Matrix({
  mat,
  reserved,
  selected,
  onToggle,
  onKeyDown,
}: {
  mat: PositionedMatrix;
  reserved: Set<string>;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, x: number, y: number) => void;
}) {
  const x0 = mat.x;
  const y0 = mat.y;

  return (
    <div
      style={{
        gridColumnStart: x0,
        gridRowStart: y0,
        gridColumnEnd: `span ${mat.columns.length}`,
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${mat.columns.length}, ${CELL}px)`,
          gap: `${GAP}px`,
        }}
      >
        {mat.columns.map((col, ci) => {
          return (
            <div
              key={`col-${ci}`}
              className="grid"
              style={{
                gridTemplateRows: `repeat(${col.length}, ${CELL}px)`,
                gap: `${GAP}px`,
              }}
            >
              {col.map((cell, ri) => {
                const x = x0 + ci;
                const y = y0 + ri;
                if (typeof cell !== "string") {
                  // label dans une matrice (rare), on l'affiche non cliquable
                  const c = cell as { type: "label"; text: string };
                  return (
                    <div
                      key={`lab-${ci}-${ri}`}
                      className="pointer-events-none select-none rounded-lg border bg-neutral-100/80 text-center text-xs italic text-neutral-600"
                      style={{ lineHeight: `${CELL - 8}px` }}
                    >
                      {c.text}
                    </div>
                  );
                }
                const id = cell as string;
                const isReserved  = reserved.has(id);
                const isSelected  = selected.has(id);

                return (
                  <button
                    key={`cell-${ci}-${ri}-${id}`}
                    data-x={x}
                    data-y={y}
                    type="button"
                    title={isReserved ? `${id} — Occupé` : `${id} — Libre`}
                    aria-pressed={isSelected}
                    aria-disabled={isReserved}
                    disabled={isReserved}
                    onClick={() => onToggle(id)}
                    onKeyDown={(e) => onKeyDown(e, x, y)}
                    className={clsx(
                      "rounded-lg border text-sm leading-none shadow-sm outline-none transition",
                      "focus-visible:ring-2 focus-visible:ring-emerald-500",
                      isReserved
                        ? "cursor-not-allowed bg-neutral-200 text-neutral-500"
                        : isSelected
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-white text-neutral-800 hover:bg-emerald-50"
                    )}
                    style={{
                      width: CELL,
                      height: CELL,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
