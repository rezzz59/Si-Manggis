// src/lib/fonnte-parser.ts

export interface FonnteWebhookPayload {
  from: string;
  message: string;
  device_id?: string;
  timestamp?: string;
  is_group?: boolean;
}

export type ApprovalAction = "SETUJU" | "TOLAK";

export interface ApprovalMessageResult {
  action: ApprovalAction;
  /** Tiket optional — kalau RT menyebut tiket di pesan, kita pakai itu untuk disambiguasi. */
  tiket?: string;
  /** Alasan optional (untuk aksi TOLAK). */
  alasan?: string;
}

/**
 * Normalisasi nomor HP Indonesia: "081234567890" → "6281234567890"
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return digits;
}

/**
 * Parse pesan balasan RT.
 *
 * Aturan SIMPLE:
 * - Case-insensitive: "setuju", "SETUJU", "Setuju", "sEtUjU" → semua dianggap SETUJU.
 * - Cukup ada kata "setuju" / "tolak" di pesan → langsung dipakai.
 * - Tiket OPTIONAL: kalau RT cuma balas "setuju" (tanpa angka apapun), sistem akan
 *   otomatis ambil permohonan terbaru status MENUNGGU_KONFIRMASI_RT untuk RT itu.
 *   Lihat: app/api/fonnte/webhook/route.ts.
 * - Kalau RT menulis 5 digit angka, itu dianggap tiket (untuk disambiguasi
 *   bila RT punya >1 permohonan pending).
 * - Untuk TOLAK, sisa kata (selain "tolak" dan tiket) dianggap alasan.
 * - Prioritas TOLAK: kalau pesan mengandung kata "setuju" DAN "tolak" sekaligus
 *   (mis. "saya tidak setuju, tolak saja"), ambil TOLAK (lebih aman).
 *
 * Contoh balasan valid:
 *   "setuju"               → SETUJU
 *   "SETUJU"               → SETUJU
 *   "Setuju"               → SETUJU
 *   "tolak"                → TOLAK
 *   "tolak ktp belum ada"  → TOLAK, alasan = "ktp belum ada"
 *   "setuju 49302"         → SETUJU, tiket = "49302"
 *   "tolak 49302 alamat salah" → TOLAK, tiket = "49302", alasan = "alamat salah"
 */
export function parseApprovalMessage(msg: string): ApprovalMessageResult | null {
  if (!msg || typeof msg !== "string") return null;

  const normalized = msg.replace(/\r/g, "").trim();
  if (!normalized) return null;

  // Ambil baris-baris awal yang bukan kutipan/forward agar tidak salah baca
  // isi pesan template yang berisi kata "tolak".
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith(">"));

  if (lines.length === 0) return null;

  const firstLine = lines[0].toLowerCase();

  // HANYA proses jika perintah eksplisit di awal balasan.
  // Ini mencegah false trigger ketika webhook menerima ulang pesan template.
  let action: ApprovalAction | null = null;
  if (/^setuju\b/.test(firstLine)) action = "SETUJU";
  if (/^tolak\b/.test(firstLine)) action = "TOLAK";

  if (!action) return null;

  // Cari tiket dari baris pertama dulu, fallback ke baris berikutnya.
  const firstLineNumbers = lines[0].match(/\d{5,12}/g) ?? [];
  const allNumbers = lines.join(" ").match(/\d{5,12}/g) ?? [];
  const numberPool = [...firstLineNumbers, ...allNumbers];

  let tiket: string | undefined;
  if (numberPool.length > 0) {
    tiket = numberPool.sort((a, b) => b.length - a.length)[0];
  }

  let alasan: string | undefined;
  if (action === "TOLAK") {
    const cleaned = lines
      .join(" ")
      .replace(/\btolak\b/gi, " ")
      .replace(/\bsetuju\b/gi, " ")
      .replace(/\b\d{5,12}\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    alasan = cleaned.length > 0 ? cleaned : undefined;
  }

  return { action, tiket, alasan };
}
