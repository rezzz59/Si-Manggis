import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

// GET /api/layanan - Ambil semua layanan
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("layanan")
      .select("*")
      .eq("is_active", true)
      .order("nama");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching layanan:", error);
    return NextResponse.json({ error: "Gagal mengambil data layanan" }, { status: 500 });
  }
}

// POST /api/layanan - Tambah layanan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, icon, estimasi, dokumen, warna_bg, warna_text } = body;

    if (!nama) {
      return NextResponse.json({ error: "Nama layanan wajib diisi" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("layanan")
      .insert({
        nama,
        icon: icon || null,
        estimasi: estimasi || null,
        dokumen: dokumen || [],
        warna_bg: warna_bg || "bg-blue-50",
        warna_text: warna_text || "text-blue-600",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating layanan:", error);
    return NextResponse.json({ error: "Gagal membuat layanan" }, { status: 500 });
  }
}

// PUT /api/layanan - Bulk update (rarely used)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data: layananList } = body;

    // For bulk operations - update multiple
    for (const layanan of layananList || []) {
      await supabaseAdmin.from("layanan").upsert(layanan);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating layanan:", error);
    return NextResponse.json({ error: "Gagal mengupdate layanan" }, { status: 500 });
  }
}

// DELETE handled by /api/layanan/[id]/route.ts
