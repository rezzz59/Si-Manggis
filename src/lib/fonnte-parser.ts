// src/lib/fonnte-parser.ts

export interface FonnteWebhookPayload {
  from: string;
  message: string;
  device_id?: string;
  timestamp?: string;
  is_group?: boolean;
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
 * "SETUJU" → { action: "SETUJU" }
 * "TOLAK [alasan]" → { action: "TOLAK", alasan: "alasan" }
 */
export function parseApprovalMessage(
  msg: string
): { action: "SETUJU" | "TOLAK"; alasan?: string } | null {
  const normalized = msg.trim().toUpperCase();

  if (normalized === "SETUJU") {
    return { action: "SETUJU" };
  }

  if (normalized.startsWith("TOLAK")) {
    const parts = msg.trim().split(/\s+/);
    const alasan = parts.slice(1).join(" ");
    return { action: "TOLAK", alasan: alasan || "(tanpa alasan)" };
  }

  return null;
}
