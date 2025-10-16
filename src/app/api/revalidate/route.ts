import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || body?.secret !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // Revalider la page (et/ou des tags si tu en utilises)
  revalidatePath("/videgrenier");
  // revalidateTag("reservations-2025");

  return NextResponse.json({ ok: true, revalidated: true });
}
