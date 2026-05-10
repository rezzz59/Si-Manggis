import { NextRequest, NextResponse } from "next/server";
import { sendFonnteWA } from "@/src/lib/fonnte";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { target, message } = body;

  if (!target || !message) {
    return NextResponse.json({ error: "target dan message wajib" }, { status: 400 });
  }

  const result = await sendFonnteWA({ target, message });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, messageId: result.messageId });
}
