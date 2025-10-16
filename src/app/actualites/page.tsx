// src/app/actualites/page.tsx
import { sanityClient } from "../../../sanity/client";
import { groq } from "next-sanity";
import Link from "next/link";

// ---- Types des actus que tu utilises dans le rendu
type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  date?: string; // ISO
};

// ---- Requête GROQ typée
const POSTS_QUERY = groq`
  *[_type == "post"] | order(date desc) {
    _id, title, slug, excerpt, date
  }
`;

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

export default async function Actualites() {
  // Sur Vercel tu peux garder le check si tu veux,
  // mais comme sanityClient est déjà configuré avec les envs,
  // on peut fetch directement.
  const posts = process.env.SANITY_PROJECT_ID
    ? await sanityClient.fetch<Post[]>(POSTS_QUERY)
    : ([] as Post[]);

  return (
    <main>
      <h1 className="text-2xl font-bold">Actualités</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article
            key={p._id}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <div className="text-sm text-neutral-500">{formatDate(p.date)}</div>
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
    </main>
  );
}
