import { NextResponse } from "next/server";
import { sanityClient, sanityWriteClient } from "../../../../sanity/client";
import { groq } from "next-sanity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Body = {
  places?: string[];
  nom?: string;
  prenom?: string;
  tel?: string;
  email?: string;
  escarenois?: boolean | string;
};

// tarifs "affiche"
function totalEscarenois(n: number, p?: any) {
  const esc1 = p?.esc1 ?? 8;
  const esc2 = p?.esc2 ?? 18;
  const esc3 = p?.esc3 ?? 33;
  const extra = p?.escExtra ?? 15;
  if (n <= 0) return 0;
  if (n === 1) return esc1;
  if (n === 2) return esc2;
  if (n === 3) return esc3;
  return esc3 + (n - 3) * extra;
}
function totalExterieur(n: number, p?: any) {
  const per = p?.extPer ?? 18;
  return Math.max(0, n) * per;
}
function computeTotal(isEscarenois: boolean, n: number, pricing?: any) {
  return isEscarenois ? totalEscarenois(n, pricing) : totalExterieur(n, pricing);
}

export async function POST(req: Request) {
  try {
    const missing = ["SANITY_PROJECT_ID","SANITY_DATASET","SANITY_WRITE_TOKEN"]
      .filter(k => !process.env[k]);
    if (missing.length) {
      return NextResponse.json({ ok:false, error:`Variables manquantes: ${missing.join(", ")}` }, { status:500 });
    }

    // 1) récupère l’évènement en ligne
    const eventQuery = groq`*[_type=="event" && status=="online"
      && (!defined(openFrom) || openFrom <= now())
      && (!defined(openUntil) || openUntil >= now())
    ][0]{ _id, date, allowedPlaces, blockedPlaces, pricing }`;
    const event = await sanityClient.fetch(eventQuery);
    if (!event) {
      return NextResponse.json({ ok:false, error:"Aucun évènement en ligne." }, { status: 409 });
    }

    // 2) payload & validations basiques
    const raw: Body = await req.json().catch(() => ({} as Body));
    const places = Array.from(
      new Set(
        (Array.isArray(raw.places) ? raw.places : [])
          .map(s => String(s).toUpperCase().trim())
          .filter(Boolean)
      )
    );
    if (!places.length) return NextResponse.json({ ok:false, error:"Aucune place reçue." }, { status:400 });
    if (!raw.nom || !raw.prenom || !raw.email)
      return NextResponse.json({ ok:false, error:"Champs obligatoires manquants (nom, prénom, email)." }, { status:400 });

    // 3) si allowedPlaces définies : les y restreindre, puis retirer celles bloquées
    let allowed: Set<string> | null = null;
    if (Array.isArray(event.allowedPlaces) && event.allowedPlaces.length) {
      allowed = new Set(event.allowedPlaces.map((s: string) => s.toUpperCase()));
    }
    const blocked = new Set((event.blockedPlaces || []).map((s: string) => s.toUpperCase()));

    if (allowed) {
      const notAllowed = places.filter(p => !allowed!.has(p));
      if (notAllowed.length) {
        return NextResponse.json({ ok:false, error:"Certaines places ne sont pas ouvertes à la réservation.", notAllowed }, { status:400 });
      }
    }
    const blockedHit = places.filter(p => blocked.has(p));
    if (blockedHit.length) {
      return NextResponse.json({ ok:false, error:"Certaines places sont bloquées.", blocked: blockedHit }, { status:400 });
    }

    // 4) conflits sur CET évènement
    const takenQuery = groq`*[_type=="reservation" && references($eventId) && status in ["pending","confirmed"]].places[]`;
    const taken: string[] = await sanityClient.fetch(takenQuery, { eventId: event._id });
    const takenSet = new Set((taken||[]).map(s => s.toUpperCase()));
    const conflicts = places.filter(p => takenSet.has(p));
    if (conflicts.length) {
      return NextResponse.json({ ok:false, error:"Certaines places sont déjà prises.", conflicts }, { status:409 });
    }

    // 5) total avec tarifs de l’évènement (fallback affiche)
    const esc = raw.escarenois === true || String(raw.escarenois).toLowerCase() === "oui";
    const count = places.length;
    const total = computeTotal(esc, count, event.pricing);

    // 6) crée la réservation liée à l'event
    const year = String(event.date || "").slice(0,4);
    const doc = await sanityWriteClient.create({
      _type: "reservation",
      event: { _type: "reference", _ref: event._id },
      year,
      status: "pending",
      nom: raw.nom,
      prenom: raw.prenom,
      tel: raw.tel || "",
      email: raw.email,
      escarenois: esc,
      places,
      count,
      total,
    });

    return NextResponse.json({ ok:true, id: doc._id, total, eventId: event._id });
  } catch (e:any) {
    console.error("POST /api/reservations failed:", e);
    return NextResponse.json({ ok:false, error: e?.message || String(e) }, { status:500 });
  }
}
