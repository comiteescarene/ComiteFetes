import { NextResponse } from "next/server";
import { groq } from "next-sanity";
import { sanityClient, sanityWriteClient } from "../../../../sanity/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const year = String(body.year || "2025");
    const places: string[] = Array.isArray(body.places)
      ? body.places.map((s: string) => String(s).toUpperCase())
      : [];
    if (!places.length) {
      return NextResponse.json({ error: "Aucune place sélectionnée." }, { status: 400 });
    }
    if (!body.nom || !body.prenom || !body.tel || !body.email) {
      return NextResponse.json({ error: "Champs requis manquants (nom, prénom, tel, email)." }, { status: 400 });
    }

    const token = process.env.SANITY_WRITE_TOKEN;
    const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (!projectId || !dataset) {
      return NextResponse.json({ error: "SANITY_PROJECT_ID / SANITY_DATASET manquants (Vercel Env)." }, { status: 500 });
    }
    if (!token) {
      return NextResponse.json({ error: "SANITY_WRITE_TOKEN manquant (déclare-le en Preview + Production sur Vercel)." }, { status: 500 });
    }

    const q = groq`*[_type=="reservation" && year==$year && status in ["pending","confirmed"]].places[]`;
    const taken: string[] = (await sanityClient.fetch(q, { year })) ?? [];
    const takenSet = new Set(taken.map((s) => s.toUpperCase()));
    const conflicts = places.filter((p) => takenSet.has(p));
    if (conflicts.length) {
      return NextResponse.json({ conflicts }, { status: 409 });
    }

    const esc = body.escarenois === true || body.escarenois === "oui";
    const per = esc ? 5 : 10;
    const total = per * Math.max(1, places.length);

    const doc = await sanityWriteClient.create({
      _type: "reservation",
      year,
      status: "pending",
      nom: String(body.nom),
      prenom: String(body.prenom),
      tel: String(body.tel),
      email: String(body.email),
      escarenois: esc,
      places,
      count: places.length,
      total,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: doc._id }, { status: 200 });
  } catch (e: any) {
    const msg =
      e?.response?.body?.error?.description ||
      e?.message ||
      "Erreur serveur (vérifie le schéma 'reservation' et le token).";
    console.error("POST /api/reservations error:", e?.response?.body || e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
