import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

// GET /api/darurat - Ambil semua nomor darurat
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("darurat")
      .select("*")
      .eq("is_active", true)
      .order("kategori");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching darurat:", error);
    return NextResponse.json({ error: "Gagal mengambil data darurat" }, { status: 500 });
  }
}

// POST /api/darurat - Tambah nomor darurat baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kategori, nama, alamat, telepon, telepon_cadangan, jam_operasional, deskripsi, warna_bg, warna_text } = body;

    if (!kategori || !nama || !telepon) {
      return NextResponse.json({ error: "Kategori, nama, dan telepon wajib diisi" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("darurat")
      .insert({
        kategori,
        nama,
        alamat: alamat || null,
        telepon,
        telepon_cadangan: telepon_cadangan || null,
        jam_operasional: jam_operasional || null,
        deskripsi: deskripsi || null,
        warna_bg: warna_bg || "bg-red-50",
        warna_text: warna_text || "text-red-600",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating darurat:", error);
    return NextResponse.json({ error: "Gagal membuat nomor darurat" }, { status: 500 });
  }
}
