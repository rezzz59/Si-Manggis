import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { parseApprovalMessage, normalizePhone } from "@/src/lib/fonnte-parser";

const STATUS_MENUNGGU_RT = "MENUNGGU_KONFIRMASI_RT";
const STATUS_DISETUJUI_RT = "DISETUJUI_RT";
const STATUS_DITOLAK_RT = "DITOLAK_RT";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from, message } = body as { from: string; message: string };

    if (!from || !message) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const normalizedFrom = normalizePhone(from);

    const { data: rtList, error: rtError } = await supabaseAdmin
      .from("rt")
      .select("id, nomor_rt, nama_ketua, no_wa_rt")
      .not("no_wa_rt", "is", null);

    if (rtError) {
      return NextResponse.json({ ok: false, error: rtError.message }, { status: 500 });
    }

    const rt = rtList?.find((item) => normalizePhone(item.no_wa_rt) === normalizedFrom);

    if (!rt) {
      return NextResponse.json({ ok: false, reason: "RT not found" }, { status: 200 });
    }

    const parsed = parseApprovalMessage(message);
    if (!parsed) {
      return NextResponse.json({ ok: true, reason: "Pesan bukan approval berbasis tiket, abaikan" });
    }

    const { data: permohonan, error: permohonanError } = await supabaseAdmin
      .from("permohonan")
      .select("id, nomor_rt, nama, status, tiket, layanan, sub_layanan, telepon")
      .eq("tiket", parsed.tiket)
      .maybeSingle();

    if (permohonanError) {
      return NextResponse.json({ ok: false, error: permohonanError.message }, { status: 500 });
    }

    if (!permohonan) {
      await sendFonnteWA({
        target: from,
        message: `Tiket ${parsed.tiket} tidak ditemukan. Pastikan format balasan benar: SETUJU ${parsed.tiket} atau TOLAK ${parsed.tiket} alasan.`,
      });
      return NextResponse.json({ ok: true, reason: "Ticket not found" });
    }

    if (permohonan.nomor_rt !== rt.nomor_rt) {
      await sendFonnteWA({
        target: from,
        message: `Tiket ${parsed.tiket} bukan milik RT ${rt.nomor_rt}. Mohon cek kembali tiket permohonan yang Anda balas.`,
      });
      return NextResponse.json({ ok: true, reason: "RT mismatch" });
    }

    if (permohonan.status !== STATUS_MENUNGGU_RT) {
      await sendFonnteWA({
        target: from,
        message: `Tiket ${parsed.tiket} sudah diproses dengan status ${permohonan.status}.`,
      });
      return NextResponse.json({ ok: true, reason: "Already processed" });
    }

    const newStatus = parsed.action === "SETUJU" ? STATUS_DISETUJUI_RT : STATUS_DITOLAK_RT;
    const now = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("permohonan")
      .update({
        status: newStatus,
        rt_approved_at: now,
        rt_approved_via: "whatsapp",
        catatan: parsed.action === "TOLAK" ? parsed.alasan : null,
        updatedat: now,
      })
      .eq("id", permohonan.id);

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    await supabaseAdmin.from("laporan_status_log").insert({
      laporan_id: permohonan.id,
      from_status: STATUS_MENUNGGU_RT,
      to_status: newStatus,
      changed_by: `RT ${rt.nomor_rt}`,
      changed_at: now,
      note: parsed.action === "TOLAK" ? parsed.alasan : "Disetujui melalui WhatsApp",
    });

    if (parsed.action === "SETUJU") {
      await sendFonnteWA({
        target: from,
        message: [
          `✅ *PERMOHONAN DISETUJUI*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket  : ${permohonan.tiket}`,
          `👤 Nama   : ${permohonan.nama}`,
          `📍 RT     : ${permohonan.nomor_rt}`,
          `━━━━━━━━━━━━━━━━━━`,
          `Status permohonan otomatis berubah menjadi ${STATUS_DISETUJUI_RT}.`,
        ].join("\n"),
      });
    } else {
      await sendFonnteWA({
        target: from,
        message: [
          `❌ *PERMOHONAN DITOLAK*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket  : ${permohonan.tiket}`,
          `👤 Nama   : ${permohonan.nama}`,
          `📍 RT     : ${permohonan.nomor_rt}`,
          `━━━━━━━━━━━━━━━━━━`,
          `Alasan: ${parsed.alasan}`,
          `Status permohonan otomatis berubah menjadi ${STATUS_DITOLAK_RT}.`,
        ].join("\n"),
      });
    }

    const kelurahanNumber = process.env.KELURAHAN_WA_NUMBER;
    if (parsed.action === "SETUJU" && kelurahanNumber) {
      await sendFonnteWA({
        target: normalizePhone(kelurahanNumber),
        message: [
          `🆕 *PERMOHONAN SIAP DIPROSES*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket   : ${permohonan.tiket}`,
          `👤 Nama    : ${permohonan.nama}`,
          `📍 RT      : ${permohonan.nomor_rt}`,
          `📄 Layanan : ${permohonan.layanan}${permohonan.sub_layanan ? `\n   Sub     : ${permohonan.sub_layanan}` : ""}`,
          `━━━━━━━━━━━━━━━━━━`,
          `RT telah menyetujui permohonan via WhatsApp.`,
        ].join("\n"),
      });
    }

    if (permohonan.telepon) {
      await sendFonnteWA({
        target: normalizePhone(permohonan.telepon),
        message:
          parsed.action === "SETUJU"
            ? `Permohonan Anda dengan tiket ${permohonan.tiket} telah disetujui RT dan akan diproses lebih lanjut.`
            : `Permohonan Anda dengan tiket ${permohonan.tiket} ditolak RT. Alasan: ${parsed.alasan}`,
      });
    }

    return NextResponse.json({ ok: true, permohonanId: permohonan.id, action: parsed.action, status: newStatus });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
