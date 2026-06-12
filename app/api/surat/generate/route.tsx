import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";
import { auth } from "@/src/lib/auth";

type PermohonanRow = {
  id: string;
  nama: string;
  nik: string | null;
  alamat: string | null;
  layanan: string;
  sub_layanan: string | null;
  tiket: string;
  createdat: string;
  nomor_rt: string | null;
  telepon: string | null;
  deskripsi: string | null;
  keperluan: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  agama: string | null;
  status_kawin: string | null;
  pendidikan_terakhir: string | null;
  pekerjaan: string | null;
};

type RtRow = {
  nomor_rt: string;
  nama_ketua: string | null;
};

const KAWIN_VALID = ["Kawin", "Belum Kawin", "Cerai Hidup", "Cerai Mati"] as const;
const PENDIDIKAN_VALID = ["SD", "SLTP", "SLTA", "D1", "D2", "D3", "S1", "S2", "S3"] as const;

function normalizeValue(val: string | null): string {
  return (val ?? "").trim();
}

function normalizeJenisKelamin(val: string | null): "L" | "P" | null {
  const v = normalizeValue(val).toLowerCase();
  if (!v) return null;
  if (v === "l" || v === "laki-laki" || v === "laki laki" || v === "laki") return "L";
  if (v === "p" || v === "perempuan" || v === "wanita") return "P";
  return null;
}

function normalizeAgama(val: string | null): "Islam" | "Kristen" | "Katholik" | "Budha" | "Hindu" | null {
  const v = normalizeValue(val).toLowerCase();
  if (!v) return null;
  if (v === "islam") return "Islam";
  if (v === "kristen") return "Kristen";
  if (v === "katolik" || v === "katholik") return "Katholik";
  if (v === "budha" || v === "buddha") return "Budha";
  if (v === "hindu") return "Hindu";
  return null;
}

function pickEnum<T extends readonly string[]>(arr: T, val: string | null): T[number] | null {
  const clean = normalizeValue(val);
  if (!clean) return null;
  return (arr as readonly string[]).includes(clean) ? (clean as T[number]) : null;
}

function formatTanggalLahirId(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

function formatTanggalSuratLong(date: Date): string {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dd = String(date.getDate());
  const mm = months[date.getMonth()];
  const yyyy = String(date.getFullYear());
  return `${dd} ${mm} ${yyyy}`;
}

const nomorUrutCache = new Map<string, number>();

async function getNomorUrut(rtNomor: string, tahun: number, bulan: number): Promise<string> {
  const key = `${rtNomor}-${tahun}-${bulan}`;
  if (nomorUrutCache.has(key)) {
    const next = (nomorUrutCache.get(key) ?? 0) + 1;
    nomorUrutCache.set(key, next);
    return String(next).padStart(4, "0");
  }

  const { count } = await supabaseAdmin
    .from("permohonan")
    .select("id", { count: "exact", head: true })
    .eq("nomor_rt", rtNomor)
    .not("surat_url", "is", null)
    .like("tiket", `${rtNomor}-%`);

  const next = (count ?? 0) + 1;
  nomorUrutCache.set(key, next);
  return String(next).padStart(4, "0");
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { permohonanId } = body as { permohonanId?: string };

  if (!permohonanId) {
    return NextResponse.json({ error: "permohonanId required" }, { status: 400 });
  }

  const { data: rawPermohonan, error: fetchError } = await supabaseAdmin
    .from("permohonan")
    .select(
      "id, nama, nik, alamat, layanan, sub_layanan, tiket, createdat, nomor_rt, telepon, " +
        "deskripsi, keperluan, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, status_kawin, pendidikan_terakhir, pekerjaan"
    )
    .eq("id", permohonanId)
    .single();

  const permohonan = rawPermohonan as PermohonanRow | null;

  if (fetchError || !permohonan) {
    return NextResponse.json({ error: "Permohonan tidak ditemukan" }, { status: 404 });
  }

  let namaPejabat: string | null = null;
  if (permohonan.nomor_rt) {
    const { data: rt } = await supabaseAdmin
      .from("rt")
      .select("nomor_rt, nama_ketua")
      .eq("nomor_rt", permohonan.nomor_rt)
      .single();
    namaPejabat = (rt as RtRow | null)?.nama_ketua ?? null;
  }

  const now = new Date();
  const tahun = now.getFullYear();
  const bulan = now.getMonth() + 1;
  const nomorUrut = await getNomorUrut(permohonan.nomor_rt ?? "00", tahun, bulan);

  const jenisKelamin = normalizeJenisKelamin(permohonan.jenis_kelamin);
  const agama = normalizeAgama(permohonan.agama);
  const statusKawin = pickEnum(KAWIN_VALID, permohonan.status_kawin);
  const pendidikan = pickEnum(PENDIDIKAN_VALID, permohonan.pendidikan_terakhir);

  const templatePath = path.join(process.cwd(), "public", "template", "BLANKO_PENGANTAR_RT_kiri.pdf");
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];

  // Template baru sudah 1 lembar, tidak perlu crop.

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const textColor = rgb(0, 0, 0);
  const pageHeight = page.getHeight();

  // pdf-lib origin: (0,0) di kiri-bawah
  // Helper ini mempertahankan kemudahan set posisi "dari atas"
  const y = (fromTop: number) => pageHeight - fromTop;

  // Fine-tune global offset untuk template baru (dari hasil uji visual)
  const TOP_OFFSET = -2;
  const yAdj = (fromTop: number) => y(fromTop + TOP_OFFSET);

  // =========================
  // KOORDINAT TERPUSAT (mudah trial-error)
  // =========================
  const POS = {
    nomor: {
      rt: { x: 178, top: 109, size: 11 },
      rw: { x: 230, top: 109, size: 11 },
      urut: { startX: 263, top: 107, boxW: 14, gap: 0, count: 3 },
      tahun: { startX: 305, top: 107, boxW: 14, gap: 0, count: 4 },
    },

    nik: { startX: 152, top: 149, boxW: 17.1, gap: 0.4, count: 16 },
    ttlDate: {
      dd: { startX: 355, top: 197, boxW: 12, gap: 0, count: 2 },
      mm: { startX: 382, top: 197, boxW: 12, gap: 0, count: 2 },
      yyyy: { startX: 410, top: 197, boxW: 10, gap: 0, count: 4 },
    },
    tanggalSurat: {
      dd: { startX: 345, top: 468, boxW: 12, gap: 0, count: 2 },
      mm: { startX: 370, top: 468, boxW: 12, gap: 0, count: 2 },
      yyyy: { startX: 396, top: 468, boxW: 10, gap: 0, count: 4 },
    },

    text: {
      nama: { x: 152, top: 174, size: 11 },
      tempatLahir: { x: 152, top: 198, size: 11 },
      pekerjaan: { x: 152, top: 320, size: 11 },
      alamat1: { x: 152, top: 344, size: 11 },
      alamat2: { x: 152, top: 362, size: 11 },
      alamat3: { x: 152, top: 380, size: 11 },
      keperluan: { x: 152, top: 393, size: 11 },

      kotaTanggal: { x: 252, top: 468, size: 10 },
      namaRt: { x: 277, top: 62, size: 10 },
      namaRw: { x: 323, top: 62, size: 10 },
      namaPejabat: { x: 294, top: 557, size: 11, bold: true },
    },

    checkbox: {
      jenisKelamin: {
        laki: { x: 162, top: 222 },
        perempuan: { x: 245, top: 222 },
      },
      agama: {
        islam: { x: 159, top: 245 },
        kristen: { x: 202, top: 245 },
        katholik: { x: 248, top: 245 },
        budha: { x: 296, top: 245 },
        hindu: { x: 343, top: 245 },
      },
      statusKawin: {
        kawin: { x: 159, top: 270 },
        belumKawin: { x: 202, top: 270 },
        ceraiHidup: { x: 273, top: 270 },
        ceraiMati: { x: 343, top: 270 },
      },
      pendidikan: {
        sd: { x: 159, top: 295 },
        sltp: { x: 190, top: 295 },
        slta: { x: 226, top: 295 },
        d1: { x: 264, top: 295 },
        d2: { x: 292, top: 295 },
        d3: { x: 320, top: 295 },
        s1: { x: 347, top: 295 },
        s2: { x: 375, top: 295 },
        s3: { x: 403, top: 295 },
      },
    },
  } as const;

  const drawField = (text: string, x: number, fromTop: number, size = 10, useBold = false) => {
    const clean = (text ?? "").toString().trim();
    if (!clean) return;
    page.drawText(clean, {
      x,
      y: yAdj(fromTop),
      size,
      font: useBold ? bold : font,
      color: textColor,
    });
  };

  const markIf = (condition: boolean, x: number, fromTop: number) => {
    if (!condition) return;
    // Geser sedikit agar X berada di tengah kotak centang
    page.drawText("X", {
      x: x + 2,
      y: yAdj(fromTop + 1),
      size: 11,
      font: bold,
      color: textColor,
    });
  };

  const drawCharsInBoxes = (
    value: string,
    box: { startX: number; top: number; boxW: number; gap: number; count: number },
    options?: { size?: number; onlyDigits?: boolean }
  ) => {
    const raw = (value ?? "").toString();
    const filtered = options?.onlyDigits ? raw.replace(/\D/g, "") : raw.replace(/[^0-9A-Za-z]/g, "");
    const chars = filtered.slice(0, box.count).split("");
    chars.forEach((ch, idx) => {
      const x = box.startX + idx * (box.boxW + box.gap) + box.boxW * 0.27;
      page.drawText(ch, {
        x,
        y: yAdj(box.top),
        size: options?.size ?? 11,
        font,
        color: textColor,
      });
    });
  };

  drawField((permohonan.nomor_rt ?? "").padStart(2, "0"), POS.nomor.rt.x, POS.nomor.rt.top, POS.nomor.rt.size);
  drawField("01", POS.nomor.rw.x, POS.nomor.rw.top, POS.nomor.rw.size);
  drawCharsInBoxes(nomorUrut, POS.nomor.urut, { size: 11, onlyDigits: true });
  drawCharsInBoxes(String(tahun), POS.nomor.tahun, { size: 11, onlyDigits: true });

  drawCharsInBoxes(permohonan.nik ?? "", POS.nik, { size: 11, onlyDigits: true });

  drawField(permohonan.nama ?? "", POS.text.nama.x, POS.text.nama.top, POS.text.nama.size);
  drawField(permohonan.tempat_lahir ?? "", POS.text.tempatLahir.x, POS.text.tempatLahir.top, POS.text.tempatLahir.size);

  const tglLahirDigits = formatTanggalLahirId(permohonan.tanggal_lahir).replace(/\D/g, "");
  drawCharsInBoxes(tglLahirDigits.slice(0, 2), POS.ttlDate.dd, { size: 11, onlyDigits: true });
  drawCharsInBoxes(tglLahirDigits.slice(2, 4), POS.ttlDate.mm, { size: 11, onlyDigits: true });
  drawCharsInBoxes(tglLahirDigits.slice(4, 8), POS.ttlDate.yyyy, { size: 11, onlyDigits: true });

  markIf(jenisKelamin === "L", POS.checkbox.jenisKelamin.laki.x, POS.checkbox.jenisKelamin.laki.top);
  markIf(jenisKelamin === "P", POS.checkbox.jenisKelamin.perempuan.x, POS.checkbox.jenisKelamin.perempuan.top);

  markIf(agama === "Islam", POS.checkbox.agama.islam.x, POS.checkbox.agama.islam.top);
  markIf(agama === "Kristen", POS.checkbox.agama.kristen.x, POS.checkbox.agama.kristen.top);
  markIf(agama === "Katholik", POS.checkbox.agama.katholik.x, POS.checkbox.agama.katholik.top);
  markIf(agama === "Budha", POS.checkbox.agama.budha.x, POS.checkbox.agama.budha.top);
  markIf(agama === "Hindu", POS.checkbox.agama.hindu.x, POS.checkbox.agama.hindu.top);

  markIf(statusKawin === "Kawin", POS.checkbox.statusKawin.kawin.x, POS.checkbox.statusKawin.kawin.top);
  markIf(statusKawin === "Belum Kawin", POS.checkbox.statusKawin.belumKawin.x, POS.checkbox.statusKawin.belumKawin.top);
  markIf(statusKawin === "Cerai Hidup", POS.checkbox.statusKawin.ceraiHidup.x, POS.checkbox.statusKawin.ceraiHidup.top);
  markIf(statusKawin === "Cerai Mati", POS.checkbox.statusKawin.ceraiMati.x, POS.checkbox.statusKawin.ceraiMati.top);

  markIf(pendidikan === "SD", POS.checkbox.pendidikan.sd.x, POS.checkbox.pendidikan.sd.top);
  markIf(pendidikan === "SLTP", POS.checkbox.pendidikan.sltp.x, POS.checkbox.pendidikan.sltp.top);
  markIf(pendidikan === "SLTA", POS.checkbox.pendidikan.slta.x, POS.checkbox.pendidikan.slta.top);
  markIf(pendidikan === "D1", POS.checkbox.pendidikan.d1.x, POS.checkbox.pendidikan.d1.top);
  markIf(pendidikan === "D2", POS.checkbox.pendidikan.d2.x, POS.checkbox.pendidikan.d2.top);
  markIf(pendidikan === "D3", POS.checkbox.pendidikan.d3.x, POS.checkbox.pendidikan.d3.top);
  markIf(pendidikan === "S1", POS.checkbox.pendidikan.s1.x, POS.checkbox.pendidikan.s1.top);
  markIf(pendidikan === "S2", POS.checkbox.pendidikan.s2.x, POS.checkbox.pendidikan.s2.top);
  markIf(pendidikan === "S3", POS.checkbox.pendidikan.s3.x, POS.checkbox.pendidikan.s3.top);

  drawField(permohonan.pekerjaan ?? "", POS.text.pekerjaan.x, POS.text.pekerjaan.top, POS.text.pekerjaan.size);

  const alamatRaw = (permohonan.alamat ?? "").trim();
  const alamatLines = [alamatRaw.slice(0, 45), alamatRaw.slice(45, 90), alamatRaw.slice(90, 135)];
  drawField(alamatLines[0] ?? "", POS.text.alamat1.x, POS.text.alamat1.top, POS.text.alamat1.size);
  drawField(alamatLines[1] ?? "", POS.text.alamat2.x, POS.text.alamat2.top, POS.text.alamat2.size);
  drawField(alamatLines[2] ?? "", POS.text.alamat3.x, POS.text.alamat3.top, POS.text.alamat3.size);

  drawField(permohonan.keperluan ?? permohonan.deskripsi ?? "", POS.text.keperluan.x, POS.text.keperluan.top, POS.text.keperluan.size);

  const tanggalSuratDigits = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getFullYear())}`;
  drawCharsInBoxes(tanggalSuratDigits.slice(0, 2), POS.tanggalSurat.dd, { size: 11, onlyDigits: true });
  drawCharsInBoxes(tanggalSuratDigits.slice(2, 4), POS.tanggalSurat.mm, { size: 11, onlyDigits: true });
  drawCharsInBoxes(tanggalSuratDigits.slice(4, 8), POS.tanggalSurat.yyyy, { size: 11, onlyDigits: true });

  drawField((permohonan.nomor_rt ?? "").padStart(2, "0"), POS.text.namaRt.x, POS.text.namaRt.top, POS.text.namaRt.size);
  drawField("01", POS.text.namaRw.x, POS.text.namaRw.top, POS.text.namaRw.size);
  drawField(`(${namaPejabat ?? ""})`, POS.text.namaPejabat.x, POS.text.namaPejabat.top, POS.text.namaPejabat.size, POS.text.namaPejabat.bold);

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  const filename = `${permohonan.tiket}.pdf`;
  const storagePath = `${tahun}/${String(bulan).padStart(2, "0")}/${filename}`;

  const { error: uploadError } = await supabaseAdmin.storage.from("surat").upload(storagePath, pdfBuffer, {
    contentType: "application/pdf",
    upsert: true,
  });

  if (uploadError) {
    return NextResponse.json(
      { error: "Gagal mengunggah surat. Silakan coba lagi." },
      { status: 500 }
    );
  }

  const { data: urlData } = await supabaseAdmin.storage.from("surat").getPublicUrl(storagePath);
  const suratUrl = urlData.publicUrl;

  const { error: updateError } = await supabaseAdmin
    .from("permohonan")
    .update({ surat_url: suratUrl })
    .eq("id", permohonanId);

  if (updateError) {
    console.error("[surat/generate] Gagal update surat_url:", updateError);
    return NextResponse.json(
      { error: "Gagal menyimpan URL surat. Silakan coba lagi." },
      { status: 500 }
    );
  }

  if (permohonan.telepon) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const cekTiketLink = baseUrl ? `${baseUrl}/cek-tiket/${permohonan.tiket}` : `/cek-tiket/${permohonan.tiket}`;

    try {
      await sendFonnteWA({
        target: normalizePhone(permohonan.telepon),
        message: [
          `✅ Surat Pengantar Anda telah siap.`,
          ``,
          `Tiket   : #${permohonan.tiket}`,
          `Layanan : ${permohonan.layanan}${permohonan.sub_layanan ? ` - ${permohonan.sub_layanan}` : ""}`,
          ``,
          `Cek status & download di:`,
          `${cekTiketLink}`,
          ``,
          `Download langsung:`,
          `${suratUrl}`,
        ].join("\n"),
      });
    } catch (waError) {
      console.error("[surat/generate] Gagal kirim WA:", waError);
    }
  }

  return NextResponse.json({ success: true, suratUrl });
}
