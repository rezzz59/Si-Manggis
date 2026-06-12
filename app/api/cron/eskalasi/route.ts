import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";

const STATUS_MENUNGGU_RT = "MENUNGGU_KONFIRMASI_RT";
const STATUS_TIDAK_MERESPONS = "RT_TIDAK_MERESPONS";
const DEFAULT_TIMEOUT_HOURS = 24;
const BATCH_LIMIT = 50;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const timeoutHours = Number(process.env.RT_APPROVAL_TIMEOUT_HOURS ?? String(DEFAULT_TIMEOUT_HOURS));
  const cutoff = new Date(Date.now() - timeoutHours * 60 * 60 * 1000).toISOString();

  const { data: expired, error: queryError } = await supabaseAdmin
    .from("permohonan")
    .select("id, tiket, nama, telepon, nomor_rt, layanan, sub_layanan, createdat")
    .eq("status", STATUS_MENUNGGU_RT)
    .lt("createdat", cutoff)
    .order("createdat", { ascending: true })
    .limit(BATCH_LIMIT);

  if (queryError) {
    console.error("[cron/eskalasi] Query error:", queryError);
    return NextResponse.json({ ok: false, error: queryError.message }, { status: 500 });
  }

  if (!expired || expired.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, ids: [] });
  }

  const processedIds: string[] = [];
  const kelurahanNumber = process.env.KELURAHAN_WA_NUMBER;

  for (const item of expired) {
    const now = new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("permohonan")
      .update({
        status: STATUS_TIDAK_MERESPONS,
        updatedat: now,
      })
      .eq("id", item.id);

    if (updateError) {
      console.error(`[cron/eskalasi] Update error for ${item.tiket}:`, updateError);
      continue;
    }

    await supabaseAdmin.from("laporan_status_log").insert({
      laporan_id: item.id,
      from_status: STATUS_MENUNGGU_RT,
      to_status: STATUS_TIDAK_MERESPONS,
      changed_by: "Sistem (Timeout konfirmasi RT)",
      changed_at: now,
      note: `RT tidak merespons konfirmasi WhatsApp dalam ${timeoutHours} jam`,
    });

    if (kelurahanNumber) {
      await sendFonnteWA({
        target: normalizePhone(kelurahanNumber),
        message: [
          `⚠️ *RT TIDAK MERESPONS*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket   : ${item.tiket}`,
          `👤 Nama    : ${item.nama}`,
          `📍 RT      : ${item.nomor_rt}`,
          `📄 Layanan : ${item.layanan}${item.sub_layanan ? `\n   Sub     : ${item.sub_layanan}` : ""}`,
          `━━━━━━━━━━━━━━━━━━`,
          `Status otomatis berubah menjadi ${STATUS_TIDAK_MERESPONS}.`,
        ].join("\n"),
      });
    }

    if (item.telepon) {
      await sendFonnteWA({
        target: normalizePhone(item.telepon),
        message: `Permohonan dengan tiket ${item.tiket} belum direspons RT dalam ${timeoutHours} jam. Status saat ini: ${STATUS_TIDAK_MERESPONS}.`,
      });
    }

    processedIds.push(item.id);
  }

  return NextResponse.json({ ok: true, processed: processedIds.length, ids: processedIds });
}
