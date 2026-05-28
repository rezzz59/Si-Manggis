import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
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

  let query = supabaseAdmin
    .from("pengaduan")
    .select("*", { count: "exact" })
    .order("createdat", { ascending: false })
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
  const { nama, telepon, email, pesan, lampiran_url, lokasi } = body;

  if (!nama || !pesan) {
    return NextResponse.json({ error: "Nama dan pesan wajib diisi" }, { status: 400 });
  }

  let tiket: string;
  do {
    tiket = generateTiket();
    const { data: existing } = await supabaseAdmin
      .from("pengaduan")
      .select("tiket")
      .eq("tiket", tiket)
      .single();
    if (!existing) break;
  } while (true);

  const lampiranArray: string[] | null = Array.isArray(lampiran_url)
    ? lampiran_url.filter((u: unknown) => typeof u === "string" && u)
    : null;

  const { data: insertedData, error } = await supabaseAdmin
    .from("pengaduan")
    .insert({
      tiket,
      nama,
      telepon: telepon || null,
      email: email || null,
      pesan,
      lampiran_url: lampiranArray,
      lokasi: lokasi || null,
      topik: null,
      status: "DIPROSES",
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const data = insertedData && insertedData.length > 0 ? insertedData[0] : null;

  if (!data) {
    return NextResponse.json({ error: "Gagal menyimpan data pengaduan" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}