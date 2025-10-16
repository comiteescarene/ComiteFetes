import ReservationClient from "./ReservationClient";

export const dynamic = "force-dynamic";

export default async function VideGrenierPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/reservations`, { cache: "no-store" }).catch(
    () => undefined
  );
  const data = await res?.json().catch(() => ({ ids: [] })) ?? { ids: [] };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Vide-grenier 2025</h1>
      <p className="mt-1 text-neutral-600">
        Cliquez sur une ou plusieurs cases libres, puis « Réserver ».
      </p>

      <div className="mt-6">
        <ReservationClient initialReserved={data.ids ?? []} />
      </div>
    </main>
  );
}
