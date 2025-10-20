import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sanityWriteClient } from "../../../../../sanity/client";

type PatchBody = { action: "confirm" | "cancel" };

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = (await req.json()) as PatchBody;
    if (!["confirm", "cancel"].includes(action)) {
      return NextResponse.json({ ok: false, error: "Bad action" }, { status: 400 });
    }
    const status = action === "confirm" ? "confirmed" : "cancelled";
    const doc = await sanityWriteClient.patch(params.id).set({ status }).commit();

    revalidatePath("/videgrenier"); // met à jour la page publique
    return NextResponse.json({ ok: true, doc });
  } catch (e) {
    console.error("PATCH /api/reservations/[id] error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
