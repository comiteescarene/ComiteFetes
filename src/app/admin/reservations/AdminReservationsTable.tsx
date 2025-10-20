"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/types/reservation";

function fmt(d?: string) {
  if (!d) return "";
  try { return new Date(d).toLocaleString("fr-FR"); } catch { return d; }
}

export default function AdminReservationsTable({ initial }: { initial: Reservation[] }) {
  const [rows, setRows] = useState<Reservation[]>(initial);

  async function doAction(id: string, action: "confirm" | "cancel") {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      alert("Action impossible.");
      return;
    }
    const { doc } = await res.json();
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: doc.status } : r)));
  }

  const csv = useMemo(() => {
    const header = ["date","status","nom","prenom","tel","email","escarenois","places","nb","total"];
    const lines = rows.map((r) =>
      [
        fmt(r.createdAt),
        r.status,
        r.nom,
        r.prenom,
        r.tel || "",
        r.email || "",
        r.escarenois ? "oui" : "non",
        r.places.join(" "),
        r.count ?? r.places.length,
        r.total ?? "",
      ].map((v) => `"${String(v).replaceAll(`"`, `""`)}"`).join(",")
    );
    return [header.join(","), ...lines].join("\n");
  }, [rows]);

  function downloadCSV() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reservations.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-neutral-600">{rows.length} réservation{rows.length > 1 ? "s" : ""}</div>
        <button onClick={downloadCSV} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <Th>Date</Th><Th>Statut</Th><Th>Nom</Th><Th>Prénom</Th><Th>Contact</Th><Th>Places</Th><Th>Total</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <Td>{fmt(r.createdAt)}</Td>
                <Td>
                  <span className={
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs " +
                    (r.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : r.status === "cancelled"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800")
                  }>
                    {r.status}
                  </span>
                </Td>
                <Td>{r.nom}</Td>
                <Td>{r.prenom}</Td>
                <Td>
                  <div className="text-neutral-700">{r.tel || "—"}</div>
                  <div className="text-neutral-500">{r.email || "—"}</div>
                </Td>
                <Td><code>{r.places.join(" ")}</code></Td>
                <Td>{r.total ? `${r.total} €` : "—"}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => doAction(r._id, "confirm")} disabled={r.status === "confirmed"}
                      className="rounded-md bg-emerald-600 px-2 py-1 text-white disabled:opacity-40">Confirmer</button>
                    <button onClick={() => doAction(r._id, "cancel")} disabled={r.status === "cancelled"}
                      className="rounded-md bg-rose-600 px-2 py-1 text-white disabled:opacity-40">Annuler</button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 text-left font-semibold text-neutral-700">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-top">{children}</td>;
}
