import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("homepage_config")
    .select("*")
    .order("section");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { section, config } = body;

  if (!section || !config) {
    return NextResponse.json(
      { error: "section dan config wajib diisi" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("homepage_config")
    .update({ config, updated_at: new Date().toISOString() })
    .eq("section", section)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
