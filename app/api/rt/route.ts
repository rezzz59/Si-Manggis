import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function GET() {
  try {
    const { data: rtList, error } = await supabaseAdmin
      .from("rt")
      .select("*")
      .order("nomor_rt", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: rtList });
  } catch (error) {
    console.error("Error fetching RT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nomor_rt, nama_ketua, no_wa_rt } = body;

    if (!nomor_rt) {
      return NextResponse.json({ error: "Nomor RT wajib diisi" }, { status: 400 });
    }

    // Check if nomor_rt already exists
    const { data: existing } = await supabaseAdmin
      .from("rt")
      .select("id")
      .eq("nomor_rt", nomor_rt)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `RT ${nomor_rt} sudah ada` },
        { status: 409 }
      );
    }

    const { data: newRt, error } = await supabaseAdmin
      .from("rt")
      .insert({
        nomor_rt,
        nama_ketua: nama_ketua || null,
        no_wa_rt: no_wa_rt || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: newRt }, { status: 201 });
  } catch (error) {
    console.error("Error creating RT:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
