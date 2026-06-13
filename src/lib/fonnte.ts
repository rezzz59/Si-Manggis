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
  countryCode = "62",
}: FonnteMessage): Promise<FonnteSendResult> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    return { success: false, error: "FONNTE_TOKEN not configured" };
  }

  const rawTarget = typeof target === "string" ? target.trim() : "";
  const digits = rawTarget.replace(/\D/g, "");
  let normalizedTarget = digits;
  if (digits.startsWith("0")) normalizedTarget = `62${digits.slice(1)}`;
  else if (!digits.startsWith("62")) normalizedTarget = `${countryCode || "62"}${digits}`;

  if (!normalizedTarget || normalizedTarget.length < 10) {
    return {
      success: false,
      error: `Target WA tidak valid: "${target}"`,
    };
  }

  console.log("[fonnte] sending →", {
    target: normalizedTarget,
    countryCode,
    tokenPrefix: token.slice(0, 6) + "...",
    tokenLength: token.length,
    messagePreview: typeof message === "string" ? message.slice(0, 60) : "",
  });

  try {
    const res = await fetch(FONNTE_URL, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        target: normalizedTarget,
        message,
        countryCode: countryCode || "62",
      }),
    });

    const responseText = await res.text();
    console.log("[fonnte] response ←", {
      status: res.status,
      ok: res.ok,
      body: responseText.slice(0, 250),
    });

    let data: unknown = null;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText;
    }

    const parsed = data as
      | {
          id?: string | string[] | number | number[];
          message_id?: string;
          message?: string;
          reason?: string;
          detail?: string;
          status?: boolean | string;
        }
      | string
      | null;

    const parsedMessage =
      typeof parsed === "object" && parsed !== null
        ? parsed.message ?? parsed.reason ?? parsed.detail
        : undefined;

    if (!res.ok) {
      return {
        success: false,
        error: parsedMessage ?? `HTTP ${res.status}`,
        statusCode: res.status,
        raw: data,
      };
    }

    if (typeof parsed === "object" && parsed !== null && parsed.status === false) {
      return {
        success: false,
        error: parsed.reason ?? parsed.message ?? parsed.detail ?? "Fonnte melaporkan status: false",
        statusCode: res.status,
        raw: data,
      };
    }

    let messageId: string | undefined;
    if (typeof parsed === "object" && parsed !== null) {
      const rawId = parsed.id ?? parsed.message_id;
      if (Array.isArray(rawId)) {
        messageId = rawId[0] != null ? String(rawId[0]) : undefined;
      } else if (rawId != null) {
        messageId = String(rawId);
      }
    }

    return {
      success: true,
      messageId,
      statusCode: res.status,
      raw: data,
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
