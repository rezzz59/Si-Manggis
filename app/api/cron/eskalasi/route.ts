// app/api/cron/eskalasi/route.ts
//
// Cron endpoint untuk fitur eskalasi timeout 3-jam.
// Dipanggil oleh Vercel Cron tiap 15 menit (lihat vercel.json).
// Bisa juga dipanggil manual untuk testing:
//
//   curl -X POST http://localhost:3000/api/cron/eskalasi \
//     -H "Authorization: Bearer $CRON_SECRET"
//
// Logic:
// 1. Cari permohonan dengan status MENUNGGU dan createdat > 3 jam lalu
// 2. Update ke ESKALASI_STAF, set eskalasi_at, log ke laporan_status_log
// 3. Kirim WA notifikasi ke KELURAHAN_WA_NUMBER (opsional)
// 4. Kirim WA notifikasi ke warga (jika ada telepon)

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";

const TIMEOUT_HOURS = 3;
const BATCH_LIMIT = 50;

export async function POST(req: NextRequest) {
  // 1. Auth check
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. Hitung cutoff timestamp (3 jam yang lalu)
  const cutoff = new Date(Date.now() - TIMEOUT_HOURS * 60 * 60 * 1000).toISOString();

  // 3. Query permohonan yang perlu di-eskalate
  // Pakai supabase (bukan admin) karena permohonan read sudah public via RLS anon
  const { data: expired, error: queryError } = await supabase
    .from("permohonan")
    .select("id, tiket, nama, telepon, nomor_rt, layanan, sub_layanan, createdat")
    .eq("status", "MENUNGGU")
    .lt("createdat", cutoff)
    .order("createdat", { ascending: true })
    .limit(BATCH_LIMIT);

  if (queryError) {
    console.error("[cron/eskalasi] Query error:", queryError);
    return NextResponse.json(
      { ok: false, error: queryError.message },
      { status: 500 }
    );
  }

  if (!expired || expired.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, ids: [] });
  }

  const processedIds: string[] = [];
  const KELURAHAN_WA = process.env.KELURAHAN_WA_NUMBER;

  // 4. Proses satu per satu
  for (const item of expired) {
    const now = new Date().toISOString();

    // 4a. Update status ke ESKALASI_STAF
    const { error: updateError } = await supabaseAdmin
      .from("permohonan")
      .update({
        status: "ESKALASI_STAF",
        eskalasi_at: now,
        updatedat: now,
      })
      .eq("id", item.id);

    if (updateError) {
      console.error(`[cron/eskalasi] Update error for ${item.tiket}:`, updateError);
      continue;
    }

    // 4b. Log ke laporan_status_log
    await supabaseAdmin.from("laporan_status_log").insert({
      laporan_id: item.id,
      from_status: "MENUNGGU",
      to_status: "ESKALASI_STAF",
      changed_by: "Sistem (Timeout 3 jam)",
      changed_at: now,
      note: `Auto-eskalasi: tidak ada respons dari RT dalam ${TIMEOUT_HOURS} jam`,
    });

    // 4c. Kirim WA ke KELURAHAN (jika configured)
    if (KELURAHAN_WA) {
      try {
        const kelurahanMsg = [
          `⚠️ *ESKALASI TIMEOUT — RT tidak merespons*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket   : #${item.tiket}`,
          `👤 Nama    : ${item.nama}`,
          `📍 RT      : ${item.nomor_rt}`,
          `📄 Jenis   : ${item.layanan}${item.sub_layanan ? `\n   Sub     : ${item.sub_layanan}` : ""}`,
          `⏰ Diajukan: ${new Date(item.createdat).toLocaleString("id-ID")}`,
          `━━━━━━━━━━━━━━━━━━`,
          `Mohon verifikasi manual.`,
        ].join("\n");

        await sendFonnteWA({
          target: normalizePhone(KELURAHAN_WA),
          message: kelurahanMsg,
        });
      } catch (err) {
        console.warn(`[cron/eskalasi] WA kelurahan gagal untuk ${item.tiket}:`, err);
      }
    }

    // 4d. Kirim WA ke warga (jika ada telepon)
    if (item.telepon) {
      try {
        const wargaMsg = [
          `⚠️ *PERMOHONAN ANDA DIAMBIL ALIH STAFF*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket  : #${item.tiket}`,
          `📍 RT     : ${item.nomor_rt}`,
          `━━━━━━━━━━━━━━━━━━`,
          `RT belum merespons dalam ${TIMEOUT_HOURS} jam.`,
          `Permohonan Anda akan diproses langsung oleh staff kelurahan.`,
        ].join("\n");

        await sendFonnteWA({
          target: normalizePhone(item.telepon),
          message: wargaMsg,
        });
      } catch (err) {
        console.warn(`[cron/eskalasi] WA warga gagal untuk ${item.tiket}:`, err);
      }
    }

    processedIds.push(item.id);
    console.log(`[cron/eskalasi] Eskalated ${item.tiket} (createdat: ${item.createdat})`);
  }

  return NextResponse.json({
    ok: true,
    processed: processedIds.length,
    ids: processedIds,
  });
}
