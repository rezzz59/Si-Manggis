import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

// GET /api/profil/[id] - Ambil pejabat spesifik
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Cek apakah ini pejabat_desa
    const { data: pejabat, error } = await supabaseAdmin
      .from("pejabat_desa")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(pejabat);
  } catch (error) {
    console.error("Error fetching pejabat:", error);
    return NextResponse.json({ error: "Pejabat tidak ditemukan" }, { status: 404 });
  }
}

// PUT /api/profil/[id] - Update pejabat spesifik
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("pejabat_desa")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating pejabat:", error);
    return NextResponse.json({ error: "Gagal mengupdate pejabat" }, { status: 500 });
  }
}

// DELETE /api/profil/[id] - Hapus pejabat
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("pejabat_desa")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pejabat:", error);
    return NextResponse.json({ error: "Gagal menghapus pejabat" }, { status: 500 });
  }
}
