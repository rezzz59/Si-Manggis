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

  const lower = msg.toLowerCase().trim();
  if (!lower) return null;

  const hasSetuju = /\bsetuju\b/.test(lower);
  const hasTolak = /\btolak\b/.test(lower);

  if (!hasSetuju && !hasTolak) {
    return null;
  }

  // Prioritas TOLAK: lebih aman menolak kalau bingung.
  const action: ApprovalAction = hasTolak ? "TOLAK" : "SETUJU";

  // Ekstrak tiket (optional) — ambil angka terpanjang (5-12 digit) agar
  // "setuju 111112" tidak salah kebaca sebagai "11111".
  const numberMatches = msg.match(/\d{5,12}/g);
  let tiket: string | undefined;
  if (numberMatches && numberMatches.length > 0) {
    tiket = numberMatches.sort((a, b) => b.length - a.length)[0];
  }

  // Untuk TOLAK, sisa kata (selain "tolak", "setuju", dan tiket) jadi alasan.
  let alasan: string | undefined;
  if (action === "TOLAK") {
    const cleaned = msg
      .replace(/\bsetuju\b/gi, " ")
      .replace(/\btolak\b/gi, " ")
      .replace(/\b\d{5}\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    alasan = cleaned.length > 0 ? cleaned : undefined;
  }

  return { action, tiket, alasan };
}
