// POST /api/permohonan
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";

export const runtime = "nodejs";

// Toggle untuk menonaktifkan field blanko surat pengantar sementara
// Saat false, semua field tambahan dikirim sebagai null
const showBlankoFields = true;

const NIK_REGEX = /^\d{16}$/;
const TELEPON_REGEX = /^(08\d{8,13}|62\d{8,13})$/;

const normalizeDigits = (value: unknown): string =>
  typeof value === "string" ? value.replace(/\D/g, "") : "";

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
      deskripsi,
      // Field tambahan untuk Surat Pengantar (blanko BANJARBARU)
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
      // Validasi wajib untuk Surat Pengantar
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
    const userId = req.cookies.get("sb-auth-token-userId")?.value ?? null;

    const { data: permohonan, error } = await supabaseAdmin
      .from("permohonan")
      .insert({
        tiket: ticket,
        nama: namaTrim,
        nik: nikNormalized,
        alamat: alamatTrim,
        nomor_rt: nomorRtDigits.slice(0, 3),
        telepon: teleponNormalized,
        layanan: jenisTrim,
        deskripsi: jenisTrim !== "surat-pengantar" ? deskripsiTrim : null,
        // Field blanko BANJARBARU
        tempat_lahir: showBlankoFields ? tempatLahirTrim : null,
        tanggal_lahir: showBlankoFields ? tanggalLahirTrim : null,
        jenis_kelamin: showBlankoFields ? jenisKelaminTrim : null,
        agama: showBlankoFields ? agamaTrim : null,
        status_kawin: showBlankoFields ? statusKawinTrim : null,
        pendidikan_terakhir: showBlankoFields ? pendidikanTerakhirTrim : null,
        pekerjaan: showBlankoFields ? pekerjaanTrim : null,
        keperluan: showBlankoFields ? keperluanTrim : null,
      })
      .select("tiket")
      .single();

    if (error) {
      console.error("Error creating permohonan:", error);
      const detail =
        typeof error.message === "string" && error.message.trim().length > 0
          ? error.message
          : typeof (error as { details?: unknown }).details === "string"
            ? ((error as { details?: string }).details ?? "")
            : "Terjadi kesalahan saat menyimpan data ke database.";
      return NextResponse.json({ error: `Gagal membuat laporan: ${detail}` }, { status: 500 });
    }

    const rtNumber = parseInt(nomorRtDigits, 10);
    if (rtNumber >= 1 && rtNumber <= 36) {
      try {
        const wa = teleponNormalized.startsWith("62")
          ? teleponNormalized
          : `62${teleponNormalized.substring(1)}`;
        await sendFonnteWA({
          target: wa,
          message: `*Si-Manggis — Permohonan Baru*\n\nWarga dengan NIK ${nikNormalized} (${namaTrim}) telah mengajukan ${jenisTrim} (RT ${nomorRtDigits}). Silakan dicek di dashboard.\nNo: ${ticket}`,
        });
      } catch (waError) {
        console.error("Gagal kirim WA ke RT:", waError);
      }
    }

    return NextResponse.json({ tiket: permohonan?.tiket });
  } catch (err) {
    console.error("POST /api/permohonan error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
