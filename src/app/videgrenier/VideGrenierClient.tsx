"use client";

import { useRouter } from "next/navigation";
import PlanCanvas from "@/components/PlanCanvas";

export default function VideGrenierClient({ reserved }: { reserved: string[] }) {
  const router = useRouter();
  return (
    <PlanCanvas
      reservedIds={reserved}
      onSubmit={(ids) => {
        const qs = new URLSearchParams({ places: ids.join(",") });
        router.push(`/reserver?${qs.toString()}`);
      }}
    />
  );
}
