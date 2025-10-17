import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { sanityClient } from "../../../../sanity/client";

type RouteParams = { slug: string };

export default async function PostPage({ params }: { params: RouteParams }) {
  const { slug } = params;

  const post = await sanityClient.fetch(
    groq`*[_type=="post" && slug.current==$slug][0]{
      title, date, excerpt, body
    }`,
    { slug }
  );

  if (!post) notFound();

  return (
    <main className="prose max-w-3xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        {post.date ? new Date(post.date).toLocaleDateString("fr-FR") : ""}
      </p>
      <h1 className="mt-1 text-3xl font-bold">{post.title}</h1>
      {post.excerpt ? (
        <p className="mt-3 text-neutral-700">{post.excerpt}</p>
      ) : null}

      {/* TODO: rendre 'body' si tu utilises PortableText */}
    </main>
  );
}

/** (Optionnel) Génération statique des slugs pour ISR/SSG */
export async function generateStaticParams(): Promise<RouteParams[]> {
  try {
    const slugs: { slug: { current: string } }[] = await sanityClient.fetch(
      groq`*[_type=="post" && defined(slug.current)].slug`
    );
    return slugs.map((s) => ({ slug: s.slug.current }));
  } catch {
    return [];
  }
}

/** (Optionnel) revalidation ISR */
export const revalidate = 60;
