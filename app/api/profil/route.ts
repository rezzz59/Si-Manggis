import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

// GET /api/profil - Ambil profil desa (single row)
export async function GET() {
  try {
    const { data: profil } = await supabaseAdmin
      .from("profil")
      .select("*")
      .limit(1)
      .single();

    const { data: pejabat } = await supabaseAdmin
      .from("pejabat_desa")
      .select("*")
      .eq("is_active", true)
      .order("jabatan");

    const { data: demografi } = await supabaseAdmin
      .from("demografi")
      .select("*")
      .limit(1)
      .single();

    return NextResponse.json({
      profil: profil || null,
      pejabat: pejabat || [],
      demografi: demografi || null,
    });
  } catch (error) {
    console.error("Error fetching profil:", error);
    return NextResponse.json({ error: "Gagal mengambil data profil" }, { status: 500 });
  }
}

// PUT /api/profil - Update profil, pejabat, dan demografi
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { profil, pejabat, demografi } = body;

    // Update profil
    if (profil) {
      const { data: existing } = await supabaseAdmin
        .from("profil")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        await supabaseAdmin
          .from("profil")
          .update({ ...profil, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabaseAdmin.from("profil").insert(profil);
      }
    }

    // Update pejabat (replace all)
    if (pejabat && Array.isArray(pejabat)) {
      // Delete existing
      await supabaseAdmin.from("pejabat_desa").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      // Insert new
      if (pejabat.length > 0) {
        await supabaseAdmin.from("pejabat_desa").insert(pejabat);
      }
    }

    // Update demografi
    if (demografi) {
      const { data: existing } = await supabaseAdmin
        .from("demografi")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        await supabaseAdmin
          .from("demografi")
          .update({ ...demografi, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabaseAdmin.from("demografi").insert(demografi);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profil:", error);
    return NextResponse.json({ error: "Gagal mengupdate profil" }, { status: 500 });
  }
}
