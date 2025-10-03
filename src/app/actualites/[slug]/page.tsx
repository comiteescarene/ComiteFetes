import { sanityClient } from "../../../../sanity/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";

export async function generateStaticParams() {
  if (!process.env.SANITY_PROJECT_ID) return [];
  const slugs:string[] = await sanityClient.fetch(
    groq`*[_type=="post" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug)=>({ slug }));
}

export default async function Article({ params }:{ params:{ slug:string } }) {
  const post = process.env.SANITY_PROJECT_ID
    ? await sanityClient.fetch(groq`*[_type=="post" && slug.current==$slug][0]{title,date,body}`, { slug: params.slug })
    : null;

  if (!post) return <main><p>Article introuvable.</p></main>;

  return (
    <main className="prose max-w-none">
      <h1>{post.title}</h1>
      <p className="text-sm text-neutral-500">{new Date(post.date).toLocaleDateString("fr-FR")}</p>
      <PortableText value={post.body} />
    </main>
  );
}
