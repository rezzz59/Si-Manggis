import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

// GET /api/rt — list all RT
export async function GET() {
  const { data, error } = await supabase
    .from("rt")
    .select("nomor_rt, nama_ketua, no_wa_rt")
    .order("nomor_rt", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}