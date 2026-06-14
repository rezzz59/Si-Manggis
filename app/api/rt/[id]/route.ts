import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: rt, error } = await supabaseAdmin
      .from("rt")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data: rt });
  } catch (error) {
    console.error("Error fetching RT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nomor_rt, nama_ketua, no_wa_rt } = body;

    // Check if RT exists
    const { data: existing } = await supabaseAdmin
      .from("rt")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "RT tidak ditemukan" }, { status: 404 });
    }

    // Check if nomor_rt is being changed and if it already exists
    if (nomor_rt) {
      const { data: duplicate } = await supabaseAdmin
        .from("rt")
        .select("id")
        .eq("nomor_rt", nomor_rt)
        .neq("id", id)
        .single();

      if (duplicate) {
        return NextResponse.json(
          { error: `RT ${nomor_rt} sudah ada` },
          { status: 409 }
        );
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (nomor_rt) updateData.nomor_rt = nomor_rt;
    if (nama_ketua !== undefined) updateData.nama_ketua = nama_ketua;
    if (no_wa_rt !== undefined) updateData.no_wa_rt = no_wa_rt;

    const { data: updatedRt, error } = await supabaseAdmin
      .from("rt")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: updatedRt });
  } catch (error) {
    console.error("Error updating RT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if RT exists
    const { data: existing } = await supabaseAdmin
      .from("rt")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "RT tidak ditemukan" }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from("rt")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting RT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
