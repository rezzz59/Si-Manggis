import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { parseApprovalMessage, normalizePhone } from "@/src/lib/fonnte-parser";

// POST /api/fonnte/webhook — Fonnte inbound webhook
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { from, message } = body as { from: string; message: string };

  if (!from || !message) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const normalizedFrom = normalizePhone(from);

  // 1. Cari RT berdasarkan no_wa_rt yang cocok dengan nomor pengirim
  const { data: rtList } = await supabase
    .from("rt")
    .select("id, nomor_rt, nama_ketua, no_wa_rt")
    .not("no_wa_rt", "is", null);

  const rt = rtList?.find((r) => normalizePhone(r.no_wa_rt) === normalizedFrom);

  if (!rt) {
    return NextResponse.json({ ok: false, reason: "RT not found" }, { status: 200 });
  }

  // 2. Parse pesan balasan
  const parsed = parseApprovalMessage(message);
  if (!parsed) {
    return NextResponse.json({ ok: true, reason: "Pesan bukan approval, abaikan" });
  }

  // 3. Cari laporan terbaru dari RT ini yang masih MENUNGGU
  const { data: laporan } = await supabase
    .from("permohonan")
    .select("id, nomor_rt, nama, status, tiket, layanan, sub_layanan")
    .eq("nomor_rt", rt.nomor_rt)
    .eq("status", "MENUNGGU")
    .order("createdat", { ascending: false })
    .limit(1)
    .single();

  if (!laporan) {
    await sendFonnteWA({
      target: from,
      message: `Tidak ada laporan pending dari RT ${rt.nomor_rt} untuk disetujui saat ini.`,
    });
    return NextResponse.json({ ok: true });
  }

  // 4. Update status
  const newStatus = parsed.action === "SETUJU" ? "DISETUJAI_RT" : "DITOLAK_RT";
  const now = new Date().toISOString();

  const { error: updateError } = await supabase
    .from("permohonan")
    .update({
      status: newStatus,
      rt_approved_at: now,
      rt_approved_via: "whatsapp",
      catatan: parsed.action === "TOLAK" ? parsed.alasan : null,
      updatedat: now,
    })
    .eq("id", laporan.id);

  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
  }

  // 5. Log status change
  await supabase.from("laporan_status_log").insert({
    laporan_id: laporan.id,
    from_status: "MENUNGGU",
    to_status: newStatus,
    changed_by: `RT ${rt.nomor_rt}`,
    changed_at: now,
    note: parsed.action === "TOLAK" ? parsed.alasan : null,
  });

  // 6. Konfirmasi ke RT
  if (parsed.action === "SETUJU") {
    await sendFonnteWA({
      target: from,
      message: [
        `✅ *LAPORAN DISETUJUI*`,
        ``,
        `━━━━━━━━━━━━━━━━━━`,
        `🎫 Tiket  : #${laporan.tiket}`,
        `👤 Nama   : ${laporan.nama}`,
        `📍 RT     : ${laporan.nomor_rt}`,
        `━━━━━━━━━━━━━━━━━━`,
        `Laporan telah diteruskan ke Kelurahan untuk diproses.`,
      ].join("\n"),
    });
  } else {
    await sendFonnteWA({
      target: from,
      message: [
        `❌ *LAPORAN DITOLAK*`,
        ``,
        `━━━━━━━━━━━━━━━━━━`,
        `🎫 Tiket  : #${laporan.tiket}`,
        `👤 Nama   : ${laporan.nama}`,
        `📍 RT     : ${laporan.nomor_rt}`,
        `━━━━━━━━━━━━━━━━━━`,
        `Alasan: ${parsed.alasan}`,
      ].join("\n"),
    });
  }

  // 7. Notifikasi ke Kelurahan
  const KELURAHAN_WA = process.env.KELURAHAN_WA_NUMBER;
  if (parsed.action === "SETUJU" && KELURAHAN_WA) {
    await sendFonnteWA({
      target: KELURAHAN_WA,
      message: [
        `🆕 *LAPORAN BARU — SIAP PROSES*`,
        ``,
        `━━━━━━━━━━━━━━━━━━`,
        `🎫 Tiket   : #${laporan.tiket}`,
        `👤 Nama    : ${laporan.nama}`,
        `📍 RT      : ${laporan.nomor_rt}`,
        `📄 Jenis   : ${laporan.layanan}${laporan.sub_layanan ? `\n   Sub    : ${laporan.sub_layanan}` : ""}`,
        `━━━━━━━━━━━━━━━━━━`,
        `RT telah menyetujui. Silakan proses sekarang.`,
      ].join("\n"),
    });
  }

  return NextResponse.json({ ok: true, laporanId: laporan.id, action: parsed.action });
}
