import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { supabase } from "@/src/lib/supabase";
import { generateTiket } from "@/src/lib/tiket";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("permohonan")
    .select("*", { count: "exact" })
    .order("createdat", { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, limit });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    nama, nik, alamat, telepon,
    jenis, sub_jenis, deskripsi, nomor_rt,
  } = body;

  if (!nama || !alamat || !telepon || !jenis || !nomor_rt) {
    return NextResponse.json({ error: "Field wajib kosong" }, { status: 400 });
  }

  if (nik && (nik.length !== 16 || !/^\d{16}$/.test(nik))) {
    return NextResponse.json({ error: "NIK harus 16 digit angka" }, { status: 400 });
  }

  const { data: rtExists } = await supabase
    .from("rt")
    .select("nomor_rt")
    .eq("nomor_rt", nomor_rt)
    .single();

  if (!rtExists) {
    return NextResponse.json({ error: "Nomor RT tidak valid" }, { status: 400 });
  }

  // Generate unique tiket
  let tiket: string;
  do {
    tiket = generateTiket();
    const { data: existing } = await supabase
      .from("permohonan")
      .select("tiket")
      .eq("tiket", tiket)
      .single();
    if (!existing) break;
  } while (true);

  // Insert into permohonan — status default "MENUNGGU"
  const { data, error } = await supabase
    .from("permohonan")
    .insert({
      tiket,
      nama,
      nik: nik || null,
      alamat,
      telepon,
      layanan: jenis,
      sub_layanan: sub_jenis || null,
      deskripsi: deskripsi || null,
      nomor_rt,
      status: "MENUNGGU",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // === Kirim WA ke RT (log error tapi jangan gagalkan submission) ===
  try {
    const { data: rt } = await supabase
      .from("rt")
      .select("nomor_rt, no_wa_rt")
      .eq("nomor_rt", nomor_rt)
      .single();

    if (rt?.no_wa_rt) {
      const waMessage = [
        `🔔 *LAPORAN BARU — RT ${nomor_rt}*`,
        ``,
        `━━━━━━━━━━━━━━━━━━`,
        `👤 Nama    : ${nama}`,
        `🪪 NIK      : ${nik || "-"}`,
        `📍 Alamat  : ${alamat}, RT ${nomor_rt}`,
        `📱 WA       : ${telepon}`,
        `━━━━━━━━━━━━━━━━━━`,
        `📄 Jenis    : ${jenis}${sub_jenis ? `\n   Sub     : ${sub_jenis}` : ""}`,
        deskripsi ? `📝 Isi      :\n${deskripsi}` : "",
        ``,
        `━━━━━━━━━━━━━━━━━━`,
        `✅ Balas *SETUJU* untuk approve`,
        `❌ Balas *TOLAK [alasan]* untuk tolak`,
        `━━━━━━━━━━━━━━━━━━`,
      ].join("\n");

      const waResult = await sendFonnteWA({
        target: normalizePhone(rt.no_wa_rt),
        message: waMessage,
      });

      if (waResult.success && waResult.messageId) {
        await supabase
          .from("permohonan")
          .update({ fonnte_msg_id: waResult.messageId })
          .eq("id", data.id);
      }

      if (!waResult.success) {
        console.warn("[permohonan] Fonnte WA gagal:", waResult.error);
      }
    } else {
      console.warn(`[permohonan] no_wa_rt not found for RT ${nomor_rt}`);
    }
  } catch (waErr) {
    console.warn("[permohonan] Fonnte WA error:", waErr);
  }

  return NextResponse.json(data, { status: 201 });
}
