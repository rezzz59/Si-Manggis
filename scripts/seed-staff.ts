// scripts/seed-staff.ts
//
// Seed akun staff default ke tabel `staff` di Supabase.
// Cara pakai:
//   npm run staff:seed
//   # atau paksa replace password:
//   npm run staff:seed -- --email admin@desaguntungmanggis.id --password admin123 --name "Admin Desa"
//
// Catatan: hash password dibuat saat script jalan (bcryptjs) supaya kita
// tidak perlu commit hash hardcoded. Default email/password di bawah
// hanya dipakai kalau tidak ada argumen CLI.

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[staff:seed] SUPABASE_URL dan SUPABASE_SERVICE_KEY harus di-set di .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Parse argumen CLI sederhana: --email X --password Y --name Z
const args = process.argv.slice(2);
const get = (flag: string, fallback: string) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const email = get("--email", "admin@desaguntungmanggis.id");
const password = get("--password", "admin123");
const name = get("--name", "Admin Desa");

async function main() {
  const hash = await bcrypt.hash(password, 10);

  // Upsert by email. Kalau sudah ada, replace password & nama.
  const { data, error } = await supabase
    .from("staff")
    .upsert(
      { email, nama: name, password: hash, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    )
    .select("id, email, nama")
    .single();

  if (error) {
    console.error("[staff:seed] Gagal upsert staff:", error.message);
    process.exit(1);
  }

  console.log("[staff:seed] Berhasil:");
  console.log(`  id    = ${data.id}`);
  console.log(`  email = ${data.email}`);
  console.log(`  nama  = ${data.nama}`);
  console.log("");
  console.log(`Login di http://localhost:3000/login dengan:`);
  console.log(`  email    = ${email}`);
  console.log(`  password = ${password}`);
}

main();
