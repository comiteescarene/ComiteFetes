import { NextResponse } from "next/server";
import { sanityClient, sanityWriteClient } from "../../../../sanity/client";
import { groq } from "next-sanity";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const year = body.year || "2025";
    const places: string[] = (body.places || []).map((s: string)=>s.toUpperCase());

    // 1) check conflits
    const q = groq`*[_type=="reservation" && year==$year && status in ["pending","confirmed"]].places[]`;
    const taken: string[] = await sanityClient.fetch(q, { year });
    const takenSet = new Set(taken.map(s=>s.toUpperCase()));
    const conflicts = places.filter(p => takenSet.has(p));
    if (conflicts.length) {
      return NextResponse.json({ conflicts }, { status: 409 });
    }

    // 2) total
    const esc = (body.escarenois === "oui" || body.escarenois === true);
    const per = esc ? 5 : 10; // tarifs de base (à externaliser si tu veux)
    const total = per * Math.max(1, places.length);

    // 3) create
    const doc = await sanityWriteClient.create({
      _type: "reservation",
      year,
      status: "pending",
      nom: body.nom, prenom: body.prenom, tel: body.tel, email: body.email,
      escarenois: esc,
      places,
      count: places.length,
      total,
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}