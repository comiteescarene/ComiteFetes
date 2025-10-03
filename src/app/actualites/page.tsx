import { sanityClient } from "../../../sanity/client";
import { groq } from "next-sanity";
import Link from "next/link";

export default async function Actualites() {
  const posts = process.env.SANITY_PROJECT_ID
    ? await sanityClient.fetch(groq`*[_type=="post"]|order(date desc){title,slug,excerpt,date}`)
    : [];
  return (
    <main>
      <h1 className="text-2xl font-bold">Actualités</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p:any) => (
          <article key={p.slug.current} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm text-neutral-500">{new Date(p.date).toLocaleDateString("fr-FR")}</div>
            <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
            <p className="mt-1 text-neutral-600 line-clamp-3">{p.excerpt}</p>
            <div className="mt-3"><Link href={`/actualites/${p.slug.current}`} className="text-emerald-700 underline">Lire</Link></div>
          </article>
        ))}
      </div>
    </main>
  );
}
