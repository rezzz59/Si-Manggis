import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { supabase } from "@/src/lib/supabase";
import { generateTiket } from "@/src/lib/tiket";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("pengaduan")
    .select("*", { count: "exact" })
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, limit });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nama, telepon, email, topik, pesan } = body;

  if (!nama || !topik || !pesan) {
    return NextResponse.json({ error: "Field wajib kosong" }, { status: 400 });
  }

  let tiket: string;
  do {
    tiket = generateTiket();
    const { data: existing } = await supabase
      .from("pengaduan")
      .select("tiket")
      .eq("tiket", tiket)
      .single();
    if (!existing) break;
  } while (true);

  const { data, error } = await supabase
    .from("pengaduan")
    .insert({ tiket, nama, telepon: telepon || null, email: email || null, topik, pesan })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
