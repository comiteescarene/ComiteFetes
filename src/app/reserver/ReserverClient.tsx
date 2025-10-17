"use client";

import { useSearchParams } from "next/navigation";
// importe ici tes composants : PlanCanvas, Formulaire, etc.

export default function ReserverClient() {
  const search = useSearchParams();
  const places = (search.get("places") ?? "").trim();

  // … ton JSX existant (PlanCanvas, formulaire, etc.)
  return (
    <div>
      {/* exemple minimal */}
      <p className="text-sm text-neutral-600">
        Places pré-sélectionnées : {places || "aucune"}
      </p>
      {/* … */}
    </div>
  );
}
