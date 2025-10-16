import { NextResponse } from "next/server";
import { sanityClient, sanityWriteClient } from "../../../../sanity/client";
import { groq } from "next-sanity";

type ReservationPayload = {
  year?: string;
  places?: string[];
  escarenois?: boolean | "oui" | "non";
  nom: string;
  prenom: string;
  tel: string;
  email: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReservationPayload;

    const year = body.year ?? "2025";
    const places = (body.places ?? []).map((s) => String(s).toUpperCase());

    // 1) conflits
    const q = groq`*[_type=="reservation" && year==$year && status in ["pending","confirmed"]].places[]`;
    const taken: string[] = await sanityClient.fetch(q, { year });
    const takenSet = new Set(taken.map((s) => s.toUpperCase()));
    const conflicts = places.filter((p) => takenSet.has(p));
    if (conflicts.length) {
      return NextResponse.json({ conflicts }, { status: 409 });
    }

    // 2) total
    const esc =
      body.escarenois === true || body.escarenois === "oui" ? true : false;
    const per = esc ? 5 : 10;
    const total = per * Math.max(1, places.length);

    // 3) create
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
    });

    return NextResponse.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
