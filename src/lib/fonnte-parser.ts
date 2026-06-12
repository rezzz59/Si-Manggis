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
  tiket: string;
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

function normalizeTicket(rawTicket: string): string {
  return rawTicket.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
}

/**
 * Parse pesan balasan RT berbasis tiket.
 * "SETUJU 062026-0001" → { action: "SETUJU", tiket: "062026-0001" }
 * "TOLAK 062026-0001 data tidak sesuai" → { action: "TOLAK", tiket: "062026-0001", alasan: "data tidak sesuai" }
 */
export function parseApprovalMessage(msg: string): ApprovalMessageResult | null {
  const trimmed = msg.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(/\s+/);
  const action = parts[0]?.toUpperCase();

  if (action !== "SETUJU" && action !== "TOLAK") {
    return null;
  }

  const tiket = normalizeTicket(parts[1] ?? "");
  if (!tiket) {
    return null;
  }

  if (action === "SETUJU") {
    return { action, tiket };
  }

  const alasan = parts.slice(2).join(" ").trim();
  return { action, tiket, alasan: alasan || "(tanpa alasan)" };
}
