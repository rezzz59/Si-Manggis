// src/lib/fonnte.ts

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const FONNTE_URL = "https://api.fonnte.com/send";

export interface FonnteMessage {
  target: string;       // nomor WA (08xxxx atau 628xxxx)
  message: string;
  countryCode?: string;  // default "+62"
}

export async function sendFonnteWA({
  target,
  message,
  countryCode = "+62",
}: FonnteMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
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

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data?.message ?? `HTTP ${res.status}` };
    }

    return { success: true, messageId: data?.id ?? data?.message_id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
