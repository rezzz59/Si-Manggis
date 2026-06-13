import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { parseApprovalMessage, normalizePhone } from "@/src/lib/fonnte-parser";

const STATUS_MENUNGGU_RT = "MENUNGGU_KONFIRMASI_RT";
const STATUS_DISETUJUI_RT = "DISETUJUI_RT";
const STATUS_DITOLAK_RT = "DITOLAK_RT";

type WebhookBody = Record<string, unknown> & {
  from?: string;
  sender?: string;
  number?: string;
  phone?: string;
  chat?: string;
  wa_number?: string;
  message?: string;
  text?: string;
  msg?: string;
  caption?: string;
  type?: string;
  event?: string;
  state?: unknown;
  stateid?: unknown;
  status?: unknown;
  data?: Record<string, unknown> & {
    sender?: string;
    from?: string;
    number?: string;
    phone?: string;
    chat?: string;
    message?: string;
    text?: string;
    msg?: string;
    caption?: string;
  };
  messageData?: Record<string, unknown> & {
    from?: string;
    message?: string;
    text?: string;
  };
  message_data?: Record<string, unknown> & {
    from?: string;
    message?: string;
    text?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    const rawText = await req.text();

    const parseMultipartFormData = (raw: string) => {
      const result: Record<string, string> = {};
      const boundaryMatch = contentType.match(/boundary=([^;]+)/i);
      if (!boundaryMatch) return result;
      const boundary = `--${boundaryMatch[1]}`;
      const parts = raw.split(boundary);

      for (const part of parts) {
        const nameMatch = part.match(/name="([^"]+)"/i);
        if (!nameMatch) continue;
        const key = nameMatch[1];
        const sectionSplit = part.split("\r\n\r\n");
        if (sectionSplit.length < 2) continue;
        const value = sectionSplit.slice(1).join("\r\n\r\n").replace(/\r\n--$/, "").trim();
        if (key && value.length > 0) result[key] = value;
      }

      return result;
    };

    let body: Record<string, unknown> = {};
    if (contentType.includes("application/json")) {
      try {
        body = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};
      } catch {
        body = {};
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(rawText);
      body = Object.fromEntries(params.entries());
    } else if (contentType.includes("multipart/form-data")) {
      body = parseMultipartFormData(rawText);
    } else {
      try {
        body = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : {};
      } catch {
        body = { raw: rawText };
      }
    }

    const bodyAny = body as WebhookBody;
    const rawKeys = Object.keys(body);

    const headersSnapshot = {
      contentType,
      userAgent: req.headers.get("user-agent"),
      xForwardedFor: req.headers.get("x-forwarded-for"),
      xForwardedProto: req.headers.get("x-forwarded-proto"),
    };

    console.log("[fonnte:webhook] request snapshot", {
      headers: headersSnapshot,
      rawPreview: rawText.slice(0, 600),
      rawLength: rawText.length,
      keys: rawKeys,
    });

    const fromCandidates = [
      bodyAny.from,
      bodyAny.sender,
      bodyAny.number,
      bodyAny.phone,
      bodyAny.chat,
      bodyAny.wa_number,
      bodyAny.data?.sender,
      bodyAny.data?.from,
      bodyAny.data?.number,
      bodyAny.data?.phone,
      bodyAny.data?.chat,
      bodyAny.messageData?.from,
      bodyAny.message_data?.from,
    ] as unknown[];

    const messageCandidates = [
      bodyAny.message,
      bodyAny.text,
      bodyAny.msg,
      bodyAny.caption,
      bodyAny.data?.message,
      bodyAny.data?.text,
      bodyAny.data?.msg,
      bodyAny.data?.caption,
      bodyAny.messageData?.message,
      bodyAny.messageData?.text,
      bodyAny.message_data?.message,
      bodyAny.message_data?.text,
    ] as unknown[];

    const from = fromCandidates.find((v) => typeof v === "string" && v.trim().length > 0) as string | undefined;
    const message = messageCandidates.find((v) => typeof v === "string" && v.trim().length > 0) as string | undefined;

    console.log("[fonnte:webhook] extracted fields", {
      fromFound: Boolean(from),
      messageFound: Boolean(message),
      fromPreview: typeof from === "string" ? from.slice(0, 20) : null,
      messagePreview: typeof message === "string" ? message.slice(0, 60) : null,
      keys: rawKeys,
    });

    if (!from || !message) {
      const eventType = (bodyAny.type ?? bodyAny.event ?? "unknown") as string;
      const hasState =
        typeof bodyAny.state !== "undefined" ||
        typeof bodyAny.stateid !== "undefined" ||
        typeof bodyAny.status !== "undefined";

      console.log("[fonnte:webhook] non-message event", {
        eventType,
        hasState,
        fromExists: Boolean(from),
        messageExists: Boolean(message),
        keys: rawKeys,
      });

      if (eventType === "webhook_status" || hasState) {
        return NextResponse.json({
          ok: true,
          ignored: true,
          reason: "status event acknowledged",
          eventType,
        });
      }

      return NextResponse.json(
        {
          ok: false,
          reason: "Payload missing required fields",
          receivedKeys: rawKeys,
        },
        { status: 400 }
      );
    }

    console.log("[fonnte:webhook] incoming message", {
      fromRaw: from,
      fromNormalized: normalizePhone(from),
      messagePreview: String(message).slice(0, 80),
      keys: rawKeys,
    });

    const normalizedFrom = normalizePhone(from);

    const { data: rtList, error: rtError } = await supabaseAdmin
      .from("rt")
      .select("id, nomor_rt, nama_ketua, no_wa_rt")
      .not("no_wa_rt", "is", null);

    if (rtError) {
      return NextResponse.json({ ok: false, error: rtError.message }, { status: 500 });
    }

    const rt = rtList?.find((item) => normalizePhone(item.no_wa_rt) === normalizedFrom);

    if (!rt) {
      return NextResponse.json({ ok: false, reason: "RT not found" }, { status: 200 });
    }

    const parsed = parseApprovalMessage(message);
    console.log("[fonnte:webhook] parsed approval", {
      parsed,
      fromNormalized: normalizedFrom,
    });

    if (!parsed) {
      await sendFonnteWA({
        target: from,
        message: [
          `🙏 Maaf Pak/Bu RT, sistem tidak mengenali balasan Anda.`,
          ``,
          `Mohon balas dengan format:`,
          `• setuju <nomor_tiket>`,
          `• tolak <nomor_tiket> <alasan>`,
          ``,
          `Contoh:`,
          `setuju 42239`,
          `tolak 42239 data belum lengkap`,
        ].join("\n"),
      });
      return NextResponse.json({ ok: true, reason: "Pesan tidak dikenali" });
    }

    let permohonan:
      | {
          id: string;
          nomor_rt: string | null;
          nama: string;
          status: string;
          tiket: string;
          layanan: string | null;
          sub_layanan: string | null;
          telepon: string | null;
        }
      | null = null;

    if (parsed.tiket) {
      console.log("[fonnte:webhook] resolving by tiket", { tiket: parsed.tiket });
      const { data, error } = await supabaseAdmin
        .from("permohonan")
        .select("id, nomor_rt, nama, status, tiket, layanan, sub_layanan, telepon")
        .eq("tiket", parsed.tiket)
        .maybeSingle();

      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }

      if (!data) {
        await sendFonnteWA({
          target: from,
          message: `❓ Tiket ${parsed.tiket} tidak ditemukan. Mohon cek kembali nomor tiketnya.`,
        });
        return NextResponse.json({ ok: true, reason: "Ticket not found" });
      }

      permohonan = data;
    } else {
      const { data: pendingList, error: pendingErr } = await supabaseAdmin
        .from("permohonan")
        .select("id, tiket, nama, layanan")
        .eq("nomor_rt", rt.nomor_rt)
        .eq("status", STATUS_MENUNGGU_RT)
        .order("createdat", { ascending: false })
        .limit(5);

      if (pendingErr) {
        return NextResponse.json({ ok: false, error: pendingErr.message }, { status: 500 });
      }

      if (!pendingList || pendingList.length === 0) {
        await sendFonnteWA({
          target: from,
          message: `ℹ️ Saat ini tidak ada permohonan yang menunggu konfirmasi dari RT ${rt.nomor_rt}.`,
        });
        return NextResponse.json({ ok: true, reason: "No pending" });
      }

      const daftar = pendingList
        .map((p, i) => `${i + 1}. *${p.tiket}* — ${p.nama} (${p.layanan ?? "-"})`)
        .join("\n");

      await sendFonnteWA({
        target: from,
        message: [
          `⚠️ Untuk mencegah salah tiket, mohon selalu sertakan *nomor tiket* saat membalas.`,
          ``,
          `Permohonan menunggu konfirmasi RT ${rt.nomor_rt}:`,
          daftar,
          ``,
          `Contoh balasan yang benar:`,
          `setuju ${pendingList[0].tiket}`,
          `tolak ${pendingList[0].tiket} alasan...`,
        ].join("\n"),
      });

      return NextResponse.json({ ok: true, reason: "Ticket required for approval reply" });
    }

    if (!permohonan) {
      return NextResponse.json({ ok: false, reason: "No permohonan resolved" }, { status: 200 });
    }

    if (permohonan.nomor_rt !== rt.nomor_rt) {
      await sendFonnteWA({
        target: from,
        message: `⚠️ Tiket ${permohonan.tiket} bukan milik RT ${rt.nomor_rt}. Mohon cek kembali.`,
      });
      return NextResponse.json({ ok: true, reason: "RT mismatch" });
    }

    if (permohonan.status !== STATUS_MENUNGGU_RT) {
      await sendFonnteWA({
        target: from,
        message: `ℹ️ Tiket ${permohonan.tiket} sudah diproses sebelumnya (status: ${permohonan.status}).`,
      });
      return NextResponse.json({ ok: true, reason: "Already processed" });
    }

    const newStatus = parsed.action === "SETUJU" ? STATUS_DISETUJUI_RT : STATUS_DITOLAK_RT;
    const now = new Date().toISOString();
    const alasanFinal = parsed.alasan && parsed.alasan.length > 0 ? parsed.alasan : "(tanpa alasan)";

    const { error: updateError } = await supabaseAdmin
      .from("permohonan")
      .update({
        status: newStatus,
        rt_approved_at: now,
        rt_approved_via: "whatsapp",
        catatan: parsed.action === "TOLAK" ? alasanFinal : null,
        updatedat: now,
      })
      .eq("id", permohonan.id);

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    await supabaseAdmin.from("laporan_status_log").insert({
      laporan_id: permohonan.id,
      from_status: STATUS_MENUNGGU_RT,
      to_status: newStatus,
      changed_by: `RT ${rt.nomor_rt}`,
      changed_at: now,
      note: parsed.action === "TOLAK" ? alasanFinal : "Disetujui melalui WhatsApp",
    });

    if (parsed.action === "SETUJU") {
      await sendFonnteWA({
        target: from,
        message: [
          `✅ *PERMOHONAN DISETUJUI*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket  : ${permohonan.tiket}`,
          `👤 Nama   : ${permohonan.nama}`,
          `📍 RT     : ${permohonan.nomor_rt}`,
          `━━━━━━━━━━━━━━━━━━`,
          `Terima kasih Pak/Bu RT 🙏`,
          `Permohonan diteruskan ke kelurahan untuk diproses.`,
        ].join("\n"),
      });
    } else {
      await sendFonnteWA({
        target: from,
        message: [
          `❌ *PERMOHONAN DITOLAK*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket  : ${permohonan.tiket}`,
          `👤 Nama   : ${permohonan.nama}`,
          `📍 RT     : ${permohonan.nomor_rt}`,
          `━━━━━━━━━━━━━━━━━━`,
          `Alasan: ${alasanFinal}`,
          `Terima kasih Pak/Bu RT 🙏`,
        ].join("\n"),
      });
    }

    const kelurahanNumber = process.env.KELURAHAN_WA_NUMBER;
    if (parsed.action === "SETUJU" && kelurahanNumber) {
      await sendFonnteWA({
        target: normalizePhone(kelurahanNumber),
        message: [
          `🆕 *PERMOHONAN SIAP DIPROSES*`,
          ``,
          `━━━━━━━━━━━━━━━━━━`,
          `🎫 Tiket   : ${permohonan.tiket}`,
          `👤 Nama    : ${permohonan.nama}`,
          `📍 RT      : ${permohonan.nomor_rt}`,
          `📄 Layanan : ${permohonan.layanan}${permohonan.sub_layanan ? `\n   Sub     : ${permohonan.sub_layanan}` : ""}`,
          `━━━━━━━━━━━━━━━━━━`,
          `RT telah menyetujui permohonan via WhatsApp.`,
        ].join("\n"),
      });
    }

    if (permohonan.telepon) {
      await sendFonnteWA({
        target: normalizePhone(permohonan.telepon),
        message:
          parsed.action === "SETUJU"
            ? `✅ Permohonan Anda dengan tiket *${permohonan.tiket}* telah *disetujui RT* dan akan diproses lebih lanjut oleh kelurahan.`
            : `❌ Permohonan Anda dengan tiket *${permohonan.tiket}* *ditolak RT*.\n\nAlasan: ${alasanFinal}`,
      });
    }

    return NextResponse.json({
      ok: true,
      permohonanId: permohonan.id,
      action: parsed.action,
      status: newStatus,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
