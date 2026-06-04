// scripts/check-surat-url.ts
//
// Debug: cek kolom surat_url di tabel permohonan
// Cara pakai: npm run check:surat-url

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[check:surat-url] SUPABASE_URL dan SUPABASE_SERVICE_KEY harus di-set di .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("[check:surat-url] Query permohonan dengan status SELESAI...\n");

  const { data, error } = await supabase
    .from("permohonan")
    .select("tiket, nama, layanan, status, surat_url, createdat")
    .eq("status", "SELESAI")
    .order("createdat", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[check:surat-url] Error:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("[check:surat-url] Tidak ada permohonan dengan status SELESAI.");
    return;
  }

  console.log(`[check:surat-url] Ditemukan ${data.length} permohonan SELESAI:\n`);
  console.log("TIKET".padEnd(20) + "NAMA".padEnd(25) + "SURAT_URL");
  console.log("-".repeat(90));

  let withUrl = 0;
  let withoutUrl = 0;

  for (const row of data) {
    const hasUrl = row.surat_url ? "✓ Ada" : "✗ NULL";
    const color = row.surat_url ? "\x1b[32m" : "\x1b[31m"; // green/red
    const reset = "\x1b[0m";

    console.log(
      row.tiket.padEnd(20) +
      (row.nama || "").slice(0, 23).padEnd(25) +
      color + hasUrl + reset
    );

    if (row.surat_url) withUrl++;
    else withoutUrl++;
  }

  console.log("\n" + "=".repeat(90));
  console.log(`Total dengan surat_url: ${withUrl}`);
  console.log(`Total TANPA surat_url:  ${withoutUrl}`);
  console.log("\nKesimpulan:");
  if (withoutUrl > 0) {
    console.log("  → Tombol download TIDAK muncul karena kolom surat_url masih NULL.");
    console.log("  → Staff harus klik 'Generate & Kirim Surat' di dashboard untuk isi surat_url.");
  } else {
    console.log("  → Semua permohonan SELESAI sudah punya surat_url.");
  }
}

main();
