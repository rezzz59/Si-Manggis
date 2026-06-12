// POST /api/permohonan
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";

export const runtime = "nodejs";

const showBlankoFields = true;
const STATUS_MENUNGGU_RT = "MENUNGGU_KONFIRMASI_RT";

const NIK_REGEX = /^\d{16}$/;
const TELEPON_REGEX = /^(08\d{8,13}|62\d{8,13})$/;

const normalizeDigits = (value: unknown): string =>
  typeof value === "string" ? value.replace(/\D/g, "") : "";

const getTimeoutHours = (): number => {
  const parsed = Number(process.env.RT_APPROVAL_TIMEOUT_HOURS ?? "24");
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
};

const stringifyValue = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const stringValue = String(value).trim();
  return stringValue.length > 0 ? stringValue : null;
};

const fitVarchar = (value: string | null, maxLength: number): string | null => {
  if (!value) return null;
  return value.slice(0, maxLength);
};

const isMissingColumnError = (error: unknown, columnName: string): boolean => {
  const message =
    typeof (error as { message?: unknown })?.message === "string"
      ? ((error as { message: string }).message ?? "")
      : "";
  return message.toLowerCase().includes(`'${columnName.toLowerCase()}'`) || message.toLowerCase().includes(`column \"${columnName.toLowerCase()}\"`);
};

async function getTiketNumber(): Promise<string> {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  for (let attempt = 0; attempt < 10; attempt++) {
    const seq = String(attempt + 1).padStart(4, "0");
    const newTiket = `${month}${year}-${seq}`;

    const { data } = await supabaseAdmin
      .from("permohonan")
      .select("id")
      .eq("tiket", newTiket)
      .limit(1);

    if (!data || data.length === 0) {
      return newTiket;
    }
  }

  const ts = String(Math.floor(Date.now() / 1000)).slice(-6);
  return `9999${Date.now()}-${ts}`;
}

function buildRtApprovalMessage({
  tiket,
  nama,
  nomorRt,
  layanan,
  subLayanan,
}: {
  tiket: string;
  nama: string;
  nomorRt: string;
  layanan: string;
  subLayanan?: string | null;
}) {
  return [
    `*Si-Manggis — Konfirmasi Permohonan Warga*`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🎫 Tiket   : ${tiket}`,
    `👤 Nama    : ${nama}`,
    `📍 RT      : ${nomorRt}`,
    `📄 Layanan : ${layanan}${subLayanan ? `\n   Sub     : ${subLayanan}` : ""}`,
    `━━━━━━━━━━━━━━━━━━`,
    `Balas salah satu format berikut:`,
    `SETUJU ${tiket}`,
    `TOLAK ${tiket} alasan`,
    ``,
    `Contoh:`,
    `SETUJU ${tiket}`,
    `TOLAK ${tiket} data domisili belum sesuai`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nama,
      nik,
      alamat,
      nomor_rt,
      telepon,
      jenis,
      sub_jenis,
      deskripsi,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      status_kawin,
      pendidikan_terakhir,
      pekerjaan,
      keperluan,
    } = body;

    const namaTrim = typeof nama === "string" ? nama.trim() : "";
    const nikNormalized = normalizeDigits(nik);
    const alamatTrim = typeof alamat === "string" ? alamat.trim() : "";
    const nomorRtTrim = typeof nomor_rt === "string" ? nomor_rt.trim() : "";
    const nomorRtDigits = normalizeDigits(nomorRtTrim);
    const teleponNormalized = normalizeDigits(telepon);
    const jenisTrim = typeof jenis === "string" ? jenis.trim() : "";
    const subJenisTrim = typeof sub_jenis === "string" ? sub_jenis.trim() : "";
    const deskripsiTrim = typeof deskripsi === "string" ? deskripsi.trim() : "";
    const tempatLahirTrim = typeof tempat_lahir === "string" ? tempat_lahir.trim() : "";
    const tanggalLahirTrim = typeof tanggal_lahir === "string" ? tanggal_lahir.trim() : "";
    const jenisKelaminTrim = typeof jenis_kelamin === "string" ? jenis_kelamin.trim() : "";
    const agamaTrim = typeof agama === "string" ? agama.trim() : "";
    const statusKawinTrim = typeof status_kawin === "string" ? status_kawin.trim() : "";
    const pendidikanTerakhirTrim = typeof pendidikan_terakhir === "string" ? pendidikan_terakhir.trim() : "";
    const pekerjaanTrim = typeof pekerjaan === "string" ? pekerjaan.trim() : "";
    const keperluanTrim = typeof keperluan === "string" ? keperluan.trim() : "";

    if (!namaTrim || !nikNormalized || !alamatTrim || !nomorRtDigits || !teleponNormalized || !jenisTrim) {
      return NextResponse.json({ error: "Nama, NIK, alamat, nomor RT, dan telepon wajib diisi." }, { status: 400 });
    }

    if (!NIK_REGEX.test(nikNormalized)) {
      return NextResponse.json({ error: "Format NIK tidak valid. NIK harus 16 digit angka." }, { status: 400 });
    }

    if (!TELEPON_REGEX.test(teleponNormalized)) {
      return NextResponse.json(
        { error: "Format nomor WA tidak valid. Gunakan 08xxxxxxxxxx atau 62xxxxxxxxxx." },
        { status: 400 }
      );
    }

    if (jenisTrim === "surat-pengantar") {
      const missingFields: string[] = [];
      if (!tempatLahirTrim) missingFields.push("tempat_lahir");
      if (!tanggalLahirTrim) missingFields.push("tanggal_lahir");
      if (!jenisKelaminTrim) missingFields.push("jenis_kelamin");
      if (!agamaTrim) missingFields.push("agama");
      if (!statusKawinTrim) missingFields.push("status_kawin");
      if (!pendidikanTerakhirTrim) missingFields.push("pendidikan_terakhir");
      if (!pekerjaanTrim) missingFields.push("pekerjaan");
      if (!keperluanTrim) missingFields.push("keperluan");

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Field wajib untuk Surat Pengantar belum diisi: ${missingFields.join(", ")}` },
          { status: 400 }
        );
      }
    }

    if (deskripsiTrim && !jenisTrim) {
      return NextResponse.json(
        { error: "Isi laporan tidak dapat dikirim tanpa jenis permohonan." },
        { status: 400 }
      );
    }

    const ticket = await getTiketNumber();
    const normalizedNomorRt = nomorRtDigits.slice(0, 3);
    const now = new Date().toISOString();
    const timeoutHours = getTimeoutHours();
    const approvalDeadlineAt = new Date(Date.now() + timeoutHours * 60 * 60 * 1000).toISOString();

    const { data: rtData, error: rtError } = await supabaseAdmin
      .from("rt")
      .select("id, nomor_rt, nama_ketua, no_wa_rt")
      .eq("nomor_rt", normalizedNomorRt)
      .maybeSingle();

    if (rtError) {
      return NextResponse.json({ error: `Gagal mengambil data RT: ${rtError.message}` }, { status: 500 });
    }

    if (!rtData?.no_wa_rt) {
      return NextResponse.json({ error: `Nomor WhatsApp RT ${normalizedNomorRt} belum tersedia.` }, { status: 400 });
    }

    const basePayload = {
      tiket: ticket,
      nama: namaTrim,
      nik: nikNormalized,
      alamat: alamatTrim,
      nomor_rt: normalizedNomorRt,
      telepon: teleponNormalized,
      layanan: fitVarchar(jenisTrim, 20),
      sub_layanan: stringifyValue(subJenisTrim),
      deskripsi: jenisTrim !== "surat-pengantar" ? stringifyValue(deskripsiTrim) : null,
      tempat_lahir: showBlankoFields ? stringifyValue(tempatLahirTrim) : null,
      tanggal_lahir: showBlankoFields ? stringifyValue(tanggalLahirTrim) : null,
      jenis_kelamin: showBlankoFields ? fitVarchar(jenisKelaminTrim, 20) : null,
      agama: showBlankoFields ? fitVarchar(agamaTrim, 20) : null,
      status_kawin: showBlankoFields ? fitVarchar(statusKawinTrim, 20) : null,
      pekerjaan: showBlankoFields ? fitVarchar(pekerjaanTrim, 50) : null,
      keperluan: showBlankoFields ? stringifyValue(keperluanTrim) : null,
      status: STATUS_MENUNGGU_RT,
      rt_approved_via: fitVarchar("waiting_whatsapp_confirmation", 20),
      updatedat: now,
    };

    const insertVariants = [
      {
        ...basePayload,
        eskalasi_at: approvalDeadlineAt,
        pendidikan_terakhir: showBlankoFields ? pendidikanTerakhirTrim : null,
      },
      {
        ...basePayload,
        pendidikan_terakhir: showBlankoFields ? pendidikanTerakhirTrim : null,
      },
      {
        ...basePayload,
        eskalasi_at: approvalDeadlineAt,
        pendidikan: showBlankoFields ? pendidikanTerakhirTrim : null,
      },
      {
        ...basePayload,
        pendidikan: showBlankoFields ? pendidikanTerakhirTrim : null,
      },
    ];

    let permohonan:
      | {
          id: string;
          tiket: string;
          layanan: string | null;
          sub_layanan: string | null;
        }
      | null = null;

    let createError: unknown = null;

    for (const payload of insertVariants) {
      const { data, error } = await supabaseAdmin
        .from("permohonan")
        .insert(payload)
        .select("id, tiket, layanan, sub_layanan")
        .single();

      if (!error && data) {
        permohonan = data;
        createError = null;
        break;
      }

      createError = error;

      if (
        isMissingColumnError(error, "pendidikan_terakhir") ||
        isMissingColumnError(error, "pendidikan") ||
        isMissingColumnError(error, "eskalasi_at")
      ) {
        continue;
      }

      break;
    }

    if (createError || !permohonan) {
      console.error("Error creating permohonan:", createError);
      const errObj = createError as { message?: string; details?: string; code?: string } | null;
      const detail =
        typeof errObj?.message === "string" && errObj.message.trim().length > 0
          ? errObj.message
          : typeof errObj?.details === "string" && errObj.details.trim().length > 0
            ? errObj.details
            : "Terjadi kesalahan saat menyimpan data ke database.";
      return NextResponse.json({ error: `Gagal membuat laporan: ${detail}` }, { status: 500 });
    }

    const approvalMessage = buildRtApprovalMessage({
      tiket: ticket,
      nama: namaTrim,
      nomorRt: normalizedNomorRt,
      layanan: fitVarchar(jenisTrim, 20) ?? jenisTrim,
      subLayanan: permohonan?.sub_layanan ?? null,
    });

    const waResult = await sendFonnteWA({
      target: normalizePhone(rtData.no_wa_rt),
      message: approvalMessage,
    });

    if (!waResult.success) {
      await supabaseAdmin
        .from("permohonan")
        .update({
          catatan: `Gagal kirim WA approval RT: ${waResult.error}`,
          updatedat: new Date().toISOString(),
        })
        .eq("id", permohonan.id);

      return NextResponse.json(
        { error: `Permohonan tersimpan, tetapi WA ke RT gagal dikirim: ${waResult.error}` },
        { status: 502 }
      );
    }

    const updatePayloads = [
      {
        fonnte_msg_id: waResult.messageId ?? null,
        updatedat: new Date().toISOString(),
      },
      {
        updatedat: new Date().toISOString(),
      },
    ];

    for (const payload of updatePayloads) {
      const { error } = await supabaseAdmin.from("permohonan").update(payload).eq("id", permohonan.id);
      if (!error) {
        break;
      }
      if (isMissingColumnError(error, "fonnte_msg_id")) {
        continue;
      }
      console.warn("Gagal update metadata Fonnte pada permohonan:", error.message);
      break;
    }

    const { error: logError } = await supabaseAdmin.from("laporan_status_log").insert({
      laporan_id: permohonan.id,
      from_status: null,
      to_status: STATUS_MENUNGGU_RT,
      changed_by: "Sistem",
      changed_at: now,
      note: `Permohonan dikirim ke RT ${normalizedNomorRt} via WhatsApp untuk konfirmasi hingga ${approvalDeadlineAt}`,
    });

    if (logError) {
      console.warn("Gagal menulis laporan_status_log, tapi permohonan sudah tersimpan:", {
        message: logError.message,
        details: (logError as { details?: string }).details,
        code: (logError as { code?: string }).code,
      });
    }

    return NextResponse.json({ tiket: permohonan.tiket, status: STATUS_MENUNGGU_RT });
  } catch (err) {
    console.error("POST /api/permohonan error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
