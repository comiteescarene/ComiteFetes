// src/app/page.tsx
import { sanityClient } from "../../sanity/client";
import { groq } from "next-sanity";
import Link from "next/link";

// -------- Types --------
type InfoCard = {
  title: string;
  desc?: string;
  href?: string;
};

type HomeData = {
  heroTitle?: string;
  heroSubtitle?: string;
  nextEvent?: string;
  infos?: InfoCard[];
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  date?: string; // ISO
};

// -------- GROQ --------
const HOME_QUERY = groq`
  *[_type == "home"][0]{
    heroTitle,
    heroSubtitle,
    nextEvent,
    infos[]->{ title, desc, href }
  }
`;

const LATEST_POSTS_QUERY = groq`
  *[_type == "post"] | order(date desc)[0...3]{
    _id, title, slug, excerpt, date
  }
`;

// -------- Utils --------
const formatFR = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

// Fallback local si Sanity pas configuré
const FALLBACK_INFOS: InfoCard[] = [
  {
    title: "Accès & stationnement",
    desc: "Plans, parkings, PMR, navettes.",
    href: "/infos/acces",
  },
  {
    title: "Horaires",
    desc: "Montage, ouverture, démontage.",
    href: "/infos/horaires",
  },
  { title: "Tarifs", desc: "Escarénois / Extérieur, modalités.", href: "/infos/tarifs" },
];

// -------- Data loaders --------
async function getHomeData(): Promise<HomeData | null> {
  if (!process.env.SANITY_PROJECT_ID) return null;
  try {
    return await sanityClient.fetch<HomeData>(HOME_QUERY);
  } catch {
    return null;
  }
}

async function getLatestPosts(): Promise<Post[]> {
  if (!process.env.SANITY_PROJECT_ID) return [];
  try {
    return await sanityClient.fetch<Post[]>(LATEST_POSTS_QUERY);
  } catch {
    return [];
  }
}

// -------- Page --------
export default async function Home() {
  const [home, posts] = await Promise.all([getHomeData(), getLatestPosts()]);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero */}
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-bold">
          {home?.heroTitle ?? "Comité des Fêtes de L’Escarène"}
        </h1>
        <p className="mt-2 text-neutral-700">
          {home?.heroSubtitle ??
            "Site officiel – réservation d’emplacements, évènements, newsletter."}
        </p>

        <div className="mt-4 rounded-lg border bg-neutral-50 p-3 text-sm">
          Prochain rendez-vous : {home?.nextEvent ?? "à compléter dans /studio"}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/reserver"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
          >
            Réserver
          </Link>
          <Link
            href="/evenements"
            className="rounded-xl border px-5 py-3 font-semibold"
          >
            Évènements
          </Link>
          <Link href="/benevoles" className="px-3 py-3 text-emerald-700 underline">
            Devenir bénévole
          </Link>
        </div>
      </section>

      {/* Infos pratiques */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Infos pratiques</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(home?.infos ?? FALLBACK_INFOS).map((c) => (
            <a
              key={c.title}
              href={c.href || "#"}
              className="rounded-xl border bg-white p-4 hover:shadow-sm"
            >
              <h3 className="font-semibold">{c.title}</h3>
              {c.desc && <p className="mt-1 text-sm text-neutral-600">{c.desc}</p>}
            </a>
          ))}
        </div>
      </section>

      {/* Actualités */}
      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Actualités</h2>
          <Link href="/actualites" className="text-sm font-semibold text-emerald-700">
            Tout voir →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p._id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="text-sm text-neutral-500">{formatFR(p.date)}</div>
              <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
              {p.excerpt && (
                <p className="mt-1 text-neutral-600 line-clamp-3">{p.excerpt}</p>
              )}
              <div className="mt-3">
                <Link
                  href={`/actualites/${p.slug.current}`}
                  className="text-emerald-700 underline"
                >
                  Lire
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
