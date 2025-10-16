import { NextResponse } from "next/server";
import { sanityClient, sanityWriteClient } from "../../../../sanity/client";
import { groq } from "next-sanity";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const year = body.year || "2025";
    const places: string[] = (body.places || []).map((s: string) => String(s).toUpperCase());

    if (!Array.isArray(places) || places.length === 0) {
      return NextResponse.json({ error: "Aucune place sélectionnée." }, { status: 400 });
    }

    // 1) Conflits
    const q = groq`*[_type=="reservation" && year==$year && status in ["pending","confirmed"]].places[]`;
    const taken: string[] = await sanityClient.fetch(q, { year });
    const takenSet = new Set((taken || []).map(s => String(s).toUpperCase()));
    const conflicts = places.filter(p => takenSet.has(p));
    if (conflicts.length) {
      return NextResponse.json({ conflicts }, { status: 409 });
    }

    // 2) Total
    const esc = body.escarenois === "oui" || body.escarenois === true;
    const per = esc ? 5 : 10;
    const total = per * Math.max(1, places.length);

    // 3) Création Sanity
    const doc = await sanityWriteClient.create({
      _type: "reservation",
      year,
      status: "pending",
      nom: body.nom,
      prenom: body.prenom,
      tel: body.tel,
      email: body.email,
      escarenois: esc,
      places,
      count: places.length,
      total,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: doc._id }, { status: 200 });
  } catch (e: any) {
    console.error("POST /api/reservations error:", e);
    const message =
      e?.response?.body?.error?.description ||
      e?.message ||
      "Erreur serveur";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// (optionnel) GET pour récupérer la liste des places déjà prises
export async function GET() {
  try {
    const year = "2025";
    const q = groq`array::unique(*[_type=="reservation" && year==$year && status in ["pending","confirmed"]].places[])`;
    const ids: string[] = await sanityClient.fetch(q, { year });
    return NextResponse.json({ ids: ids?.map(s => String(s).toUpperCase()) ?? [] });
  } catch (e: any) {
    console.error("GET /api/reservations error:", e);
    return NextResponse.json({ ids: [] }, { status: 200 });
  }
}
