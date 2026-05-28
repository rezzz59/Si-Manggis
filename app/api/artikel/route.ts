import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("artikel")
    .select("*")
    .eq("is_published", true)
    .order("tgl_publish", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { judul, excerpt, konten, gambar_url, kategori, tgl_publish, is_featured } = body;

  if (!judul) return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 });

  const slug = judul
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const { data, error } = await supabaseAdmin
    .from("artikel")
    .insert({
      judul,
      slug,
      excerpt: excerpt ?? "",
      konten: konten ?? "",
      gambar_url: gambar_url ?? "/img/bg.png",
      kategori: kategori ?? "berita",
      tgl_publish: tgl_publish ?? new Date().toISOString().split("T")[0],
      is_featured: is_featured ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
