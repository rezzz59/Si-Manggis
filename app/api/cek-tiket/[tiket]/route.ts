import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ tiket: string }> }) {
  const { tiket: rawTiket } = await params;
  const tiket = rawTiket.toUpperCase().trim();

  const [permohonanResult, pengaduanResult] = await Promise.all([
    supabase.from("permohonan").select("*").eq("tiket", tiket).single(),
    supabase.from("pengaduan").select("*").eq("tiket", tiket).single(),
  ]);

  if (!permohonanResult.data && !pengaduanResult.data) {
    return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({
    tiket,
    permohonan: permohonanResult.data,
    pengaduan: pengaduanResult.data,
  });
}
