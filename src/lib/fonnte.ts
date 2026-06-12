// src/lib/fonnte.ts
// WhatsApp gateway using Fonnte API

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const FONNTE_URL = "https://api.fonnte.com/send";

export interface FonnteMessage {
  target: string;
  message: string;
  countryCode?: string;
}

export interface FonnteSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  statusCode?: number;
  raw?: unknown;
}

export async function sendFonnteWA({
  target,
  message,
  countryCode = "+62",
}: FonnteMessage): Promise<FonnteSendResult> {
  if (!FONNTE_TOKEN) {
    return { success: false, error: "FONNTE_TOKEN not configured" };
  }

  try {
    const res = await fetch(FONNTE_URL, {
      method: "POST",
      headers: {
        Authorization: FONNTE_TOKEN,
      },
      body: new URLSearchParams({
        target,
        message,
        countryCode: countryCode || "62",
      }),
    });

    const responseText = await res.text();
    let data: unknown = null;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText;
    }

    const parsed = data as
      | { id?: string; message_id?: string; message?: string; reason?: string; status?: boolean | string }
      | string
      | null;

    if (!res.ok) {
      return {
        success: false,
        error:
          typeof parsed === "object" && parsed !== null
            ? parsed.message ?? parsed.reason ?? `HTTP ${res.status}`
            : `HTTP ${res.status}`,
        statusCode: res.status,
        raw: data,
      };
    }

    return {
      success: true,
      messageId: typeof parsed === "object" && parsed !== null ? parsed.id ?? parsed.message_id : undefined,
      statusCode: res.status,
      raw: data,
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
