"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
// ⬅️ choisis un des deux imports (garde UNE ligne)
import { NAV_ITEMS} from "../config/nav";
// import { NAV_ITEMS, CTA } from "@/config/nav"; // si alias @ actif

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const items = Array.isArray(NAV_ITEMS) ? NAV_ITEMS : []; // sécurité

  return (
    <header className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo / titre */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
            CF
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-neutral-800">Comité des Fêtes</div>
            <div className="text-xs text-neutral-500">L’Escarène</div>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-2 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                isActive(item.href)
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Burger mobile */}
        <button
          className="inline-flex items-center rounded-lg border px-3 py-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
