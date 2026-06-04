// scripts/list-staff.ts
//
// Print semua akun staff dari tabel `staff` (password disembunyikan).
// Cara pakai:
//   npm run staff:list

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[staff:list] SUPABASE_URL dan SUPABASE_SERVICE_KEY harus di-set di .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data, error } = await supabase
    .from("staff")
    .select("id, email, nama, created_at, updated_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[staff:list] Gagal query:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("[staff:list] Tabel staff kosong. Jalankan `npm run staff:seed` dulu.");
    return;
  }

  console.log(`[staff:list] ${data.length} akun staff:`);
  console.log("");
  console.log("  EMAIL".padEnd(40) + "NAMA".padEnd(25) + "CREATED");
  console.log("  " + "-".repeat(85));
  for (const s of data) {
    console.log(
      "  " +
        s.email.padEnd(40) +
        (s.nama ?? "").padEnd(25) +
        new Date(s.created_at).toISOString().slice(0, 10)
    );
  }
}

main();
