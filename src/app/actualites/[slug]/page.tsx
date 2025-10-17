// src/app/actualites/[slug]/page.tsx
import { sanityClient } from "../../../../sanity/client";
import { groq } from "next-sanity";
import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: { slug: string }; // <- objet simple, PAS de Promise
}) {
  if (!process.env.SANITY_PROJECT_ID) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p>Le CMS n’est pas encore configuré.</p>
        <Link href="/actualites" className="text-emerald-700 underline">
          ← Retour aux actualités
        </Link>
      </main>
    );
  }

  const query = groq`*[_type=="post" && slug.current == $slug][0]{
    title, date, excerpt, body
  }`;

  const post = await sanityClient.fetch(query, { slug: params.slug });

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p>Article introuvable.</p>
        <Link href="/actualites" className="text-emerald-700 underline">
          ← Retour aux actualités
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="text-sm text-neutral-500">
        {post.date ? new Date(post.date).toLocaleDateString("fr-FR") : ""}
      </div>
      <h1 className="mt-1 text-3xl font-bold">{post.title}</h1>
      {post.excerpt ? <p className="mt-3 text-neutral-700">{post.excerpt}</p> : null}
      {/* Remplace ce <pre> par ton renderer PortableText si tu en as un */}
      {post.body ? (
        <pre className="mt-6 whitespace-pre-wrap rounded-xl border bg-white p-4">
          {JSON.stringify(post.body, null, 2)}
        </pre>
      ) : null}
      <div className="mt-8">
        <Link href="/actualites" className="text-emerald-700 underline">
          ← Retour aux actualités
        </Link>
      </div>
    </main>
  );
}
