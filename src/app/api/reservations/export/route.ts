import { NextResponse } from "next/server";
import { sanityClient } from "../../../../../sanity/client";
import { groq } from "next-sanity";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get("eventId") || "";
  if (!eventId) return NextResponse.json({error:"eventId requis"}, {status:400});

  const fair = await sanityClient.fetch(
    groq`*[_type=="fair" && _id==$id][0]{title,date}`, {id: eventId}
  );

  const rows = await sanityClient.fetch(groq`
    *[_type=="reservation" && event._ref==$id && status in ["pending","confirmed"]]
    | order(nom asc){
      nom, prenom, email, tel, escarenois, places, total,
      "paiement": paiement.type, "banque": paiement.banque, "cheque": paiement.numeroCheque, "paid": paiement.paid
    }`, {id: eventId});

  const header = [
    "Nom","Prénom","Email","Téléphone","Escarénois","Places","Total (€)","Paiement","Banque","N° chèque","Payé"
  ].join(";");

  const body = rows.map((r:any) => ([
    r.nom||"", r.prenom||"", r.email||"", r.tel||"",
    r.escarenois?"oui":"non",
    Array.isArray(r.places)?r.places.join(", "):"",
    r.total ?? "",
    r.paiement ?? "",
    r.banque ?? "",
    r.cheque ?? "",
    r.paid ? "oui" : "non",
  ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(";"))).join("\n");

  const csv = [header, body].join("\n");
  const fname = `exposants_${(fair?.date||'').replaceAll('-','')}_${(fair?.title||'vg').replace(/\s+/g,'_')}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fname}"`,
    },
  });
}
