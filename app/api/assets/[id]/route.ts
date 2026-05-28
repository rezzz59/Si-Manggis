import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("website_assets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Aset tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const allowedFields = ["alt_text", "caption", "category", "is_active", "sort_order"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const key of allowedFields) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  const { data, error } = await supabaseAdmin
    .from("website_assets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // Get asset first to delete from storage
  const { data: asset, error: fetchError } = await supabaseAdmin
    .from("website_assets")
    .select("filename, storage_url")
    .eq("id", id)
    .single();

  if (fetchError || !asset) {
    return NextResponse.json({ error: "Aset tidak ditemukan" }, { status: 404 });
  }

  // Delete from storage
  await supabaseAdmin.storage.from("website-assets").remove([asset.filename]);

  // Delete from DB
  const { error: deleteError } = await supabaseAdmin
    .from("website_assets")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}