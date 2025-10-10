import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Comité des Fêtes de L’Escarène",
  description: "Brocante, animations et évènements du village.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-neutral-50 text-neutral-900">
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
