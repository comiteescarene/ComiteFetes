"use client";
export default function Env() {
  return (
    <pre className="p-4">
      NEXT_PUBLIC_SANITY_PROJECT_ID = {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "undefined"}
      {"\n"}
      NEXT_PUBLIC_SANITY_DATASET    = {process.env.NEXT_PUBLIC_SANITY_DATASET || "undefined"}
    </pre>
  );
}
