import { PLAN_ROWS } from "@/data/planLayout";
import PlanBoard from "@/components/PlanBoard";
import { getReservedSet } from "@/lib/reserved";

const YEAR = "2025";

export default async function VideGrenier() {
  const reservedSet = await getReservedSet(YEAR);

  return (
    <main className="mx-auto max-w-[1400px] px-4">
      <h1 className="text-2xl font-bold">Vide-grenier {YEAR}</h1>
      <p className="mt-2 text-neutral-600">Cliquez sur une ou plusieurs cases libres, puis “Réserver”.</p>

      <PlanBoard rows={PLAN_ROWS} reserved={[...reservedSet]} />
    </main>
  );
}
