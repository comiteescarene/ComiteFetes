import { NextResponse } from "next/server";
import { sanityWriteClient } from "../../../../../sanity/client";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ ok: false, error: "Bad status" }, { status: 400 });
    }

    const doc = await sanityWriteClient
      .patch(params.id)
      .set({ status })
      .commit();

    return NextResponse.json({ ok: true, doc });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
