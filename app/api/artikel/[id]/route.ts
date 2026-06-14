import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("artikel")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { judul, excerpt, konten, gambar_url, kategori, tgl_publish, is_published, is_featured } = body;

    // Check if article exists
    const { data: existing } = await supabaseAdmin
      .from("artikel")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (judul) {
      updateData.judul = judul;
      updateData.slug = judul
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (konten !== undefined) updateData.konten = konten;
    if (gambar_url !== undefined) updateData.gambar_url = gambar_url;
    if (kategori !== undefined) updateData.kategori = kategori;
    if (tgl_publish !== undefined) updateData.tgl_publish = tgl_publish;
    if (is_published !== undefined) updateData.is_published = is_published;
    if (is_featured !== undefined) updateData.is_featured = is_featured;

    const { data: updated, error } = await supabaseAdmin
      .from("artikel")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if article exists
    const { data: existing } = await supabaseAdmin
      .from("artikel")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from("artikel")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
