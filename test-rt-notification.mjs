import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { sendFonnteWA } from "./src/lib/fonnte.ts";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("SUPABASE_URL atau SUPABASE_SERVICE_KEY belum terpasang di environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data, error } = await supabase
    .from("rt")
    .select("nomor_rt, nama_ketua, no_wa_rt")
    .not("no_wa_rt", "is", null)
    .limit(1);

  if (error) {
    console.error("Error fetching RT:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No RT with WhatsApp number found");
    return;
  }

  const rt = data[0];
  console.log(`Testing notification to RT ${rt.nomor_rt} (${rt.nama_ketua ?? "-"})`);
  console.log(`WhatsApp number: ${rt.no_wa_rt}`);

  const testMessage =
    "[TEST] Ini adalah pesan tes dari sistem Si-Manggis untuk memastikan notifikasi ke RT berfungsi.";

  console.log("Sending test message...");
  const result = await sendFonnteWA({
    target: String(rt.no_wa_rt),
    message: testMessage,
  });

  console.log("Result:", result);
  if (result.success) {
    console.log("✅ Test message sent successfully!");
  } else {
    console.log("❌ Failed to send test message:", result.error);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
