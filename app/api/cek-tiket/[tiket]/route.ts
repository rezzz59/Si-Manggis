import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ tiket: string }> }) {
  const { tiket: rawTiket } = await params;
  const tiket = rawTiket.toUpperCase().trim();

  // Prioritas: permohonan (laporan/aduan baru)
  const { data: permohonan } = await supabase
    .from("permohonan")
    .select("*")
    .eq("tiket", tiket)
    .single();

  if (permohonan) {
    return NextResponse.json(permohonan);
  }

  // Fallback: pengaduan lama
  const { data: pengaduan } = await supabase
    .from("pengaduan")
    .select("*")
    .eq("tiket", tiket)
    .single();

  if (pengaduan) {
    return NextResponse.json(pengaduan);
  }

  return NextResponse.json({ error: "Tiket tidak ditemukan" }, { status: 404 });
}
