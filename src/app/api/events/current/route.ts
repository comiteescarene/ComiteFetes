import { NextResponse } from "next/server";
import { sanityClient } from "../../../../../sanity/client";
import { groq } from "next-sanity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Évènement avec status online + éventuelle fenêtre d'ouverture
  const query = groq`*[_type=="event" && status=="online"
    && (!defined(openFrom) || openFrom <= now())
    && (!defined(openUntil) || openUntil >= now())
  ][0]{ _id, title, slug, date, status, allowedPlaces, blockedPlaces, pricing }`;

  const evt = await sanityClient.fetch(query);
  if (!evt) return NextResponse.json({ ok:false, error:"Aucun évènement en ligne" }, { status:404 });

  return NextResponse.json({ ok:true, event: evt });
}
