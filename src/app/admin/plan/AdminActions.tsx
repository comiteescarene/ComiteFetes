"use client";

import { useRouter } from "next/navigation";

export default function AdminActions({
  id,
  status,
}: {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
}) {
  const router = useRouter();

  async function setStatus(next: "pending" | "confirmed" | "cancelled") {
    const res = await fetch(`/api/reservations/${id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      const msg = await res.text();
      alert(`Erreur: ${res.status} — ${msg}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex gap-2 text-xs">
      {status !== "confirmed" && (
        <button
          onClick={() => setStatus("confirmed")}
          className="rounded border px-2 py-1 hover:bg-neutral-50"
        >
          Confirmer
        </button>
      )}
      {status !== "pending" && (
        <button
          onClick={() => setStatus("pending")}
          className="rounded border px-2 py-1 hover:bg-neutral-50"
        >
          Repasser en attente
        </button>
      )}
      <button
        onClick={() => setStatus("cancelled")}
        className="rounded border px-2 py-1 hover:bg-neutral-50"
      >
        Annuler
      </button>
    </div>
  );
}
