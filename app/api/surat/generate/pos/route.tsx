import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";
import { auth } from "@/src/lib/auth";
import { chromium } from "playwright-core";

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

function normalizeValue(v: string | null) {
  return (v ?? "").trim();
}

function pilihanCheck(val: boolean) {
  return val ? "checked" : "";
}

function formatTanggalIndonesia(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTempatTanggalLahir(tempat: string | null, tanggal: string | null) {
  const t = normalizeValue(tempat);
  if (!tanggal) return t;
  const d = new Date(tanggal);
  const tanggalStr = Number.isNaN(d.getTime())
    ? String(tanggal)
    : d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  return [t, tanggalStr].filter(Boolean).join(", ");
}

function renderHtmlTemplate(params: {
  permohonan: PermohonanRow;
  namaKetuaRt: string;
  nomorRw: string;
  nomorSurat: string;
  tanggalHariIni: string;
  logoDataUri: string;
}) {
  const { permohonan, namaKetuaRt, nomorRw, nomorSurat, tanggalHariIni, logoDataUri } = params;

  const jenisKelamin = normalizeValue(permohonan.jenis_kelamin).toLowerCase();
  const agama = normalizeValue(permohonan.agama).toLowerCase();
  const statusKawin = normalizeValue(permohonan.status_kawin).toLowerCase();
  const pendidikan = normalizeValue(permohonan.pendidikan_terakhir).toUpperCase();

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Surat Pengantar RT</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Times New Roman", Times, serif; font-size: 12pt; color: #000; }
  .page {
    width: 210mm; min-height: 297mm; background: #fff;
    padding: 20mm 20mm 20mm 25mm;
    display: flex; flex-direction: column;
  }
  .kop {
    display: flex; align-items: center; gap: 14px;
    padding-bottom: 8px; border-bottom: 4px double #000;
  }
  .kop-logo { width: 72px; height: 72px; object-fit: contain; }
  .kop-text { flex: 1; text-align: center; line-height: 1.35; }
  .kop-instansi { font-size: 13pt; font-weight: bold; text-transform: uppercase; }
  .kop-kecamatan { font-size: 12pt; font-weight: bold; text-transform: uppercase; }
  .kop-kelurahan { font-size: 12.5pt; font-weight: bold; text-transform: uppercase; }
  .kop-rt-rw { font-size: 12pt; font-weight: bold; text-transform: uppercase; }
  .judul-wrapper { text-align: center; margin-top: 14px; margin-bottom: 4px; }
  .judul-surat {
    font-size: 13pt; font-weight: bold; text-decoration: underline;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .nomor-surat { font-size: 11.5pt; margin-top: 3px; }
  .pembuka, .penutup { margin-top: 14px; margin-bottom: 10px; line-height: 1.6; text-align: justify; }
  .data-table { width: 100%; border-collapse: collapse; line-height: 1.8; }
  .data-table td { vertical-align: top; padding: 1px 0; }
  .col-label { width: 36mm; white-space: nowrap; }
  .col-colon { width: 6mm; text-align: center; font-weight: bold; }
  .col-value { border-bottom: 1px solid #000; padding-bottom: 2px; min-width: 80mm; }
  .no-underline .col-value { border-bottom: none; }
  .options { display: inline-flex; flex-wrap: wrap; gap: 12px; align-items: center; }
  .opt { display: inline-flex; align-items: center; gap: 4px; }
  .opt-box {
    display: inline-block; width: 13px; height: 13px;
    border: 1.2px solid #000; vertical-align: middle;
  }
  .opt-box.checked::after {
    content: "✓"; font-size: 10pt; line-height: 13px; display: block; text-align: center;
  }
  .ttd-wrapper { margin-top: 20px; display: flex; justify-content: flex-end; }
  .ttd-block { text-align: center; min-width: 160px; }
  .ttd-space { height: 55px; }
  .ttd-nama { border-top: 1px solid #000; padding-top: 3px; min-width: 130px; display: inline-block; }
  .footnote { margin-top: auto; padding-top: 14px; font-size: 9.5pt; font-style: italic; border-top: 1px solid #ccc; }
</style>
</head>
<body>
<div class="page">
  <header class="kop">
    <img src="${logoDataUri}" alt="Logo Kota Banjarbaru" class="kop-logo" />
    <div class="kop-text">
      <p class="kop-instansi">Pemerintah Kota Banjarbaru</p>
      <p class="kop-kecamatan">Kecamatan Landasan Ulin</p>
      <p class="kop-kelurahan">Kelurahan Guntung Manggis</p>
      <p class="kop-rt-rw">Ketua RT. ${permohonan.nomor_rt ?? "-"}&nbsp;&nbsp;RW. ${nomorRw}</p>
    </div>
  </header>

  <div class="judul-wrapper">
    <div class="judul-surat">Surat Pengantar</div>
    <div class="nomor-surat">Nomor&nbsp;:&nbsp;${nomorSurat}</div>
  </div>

  <p class="pembuka">
    Yang bertanda tangan dibawah ini Ketua RT.&nbsp;<strong>${permohonan.nomor_rt ?? "-"}</strong>
    &nbsp;RW.&nbsp;<strong>${nomorRw}</strong>, dengan ini menerangkan bahwa&nbsp;:
  </p>

  <table class="data-table">
    <tbody>
      <tr><td class="col-label">NIK</td><td class="col-colon">:</td><td class="col-value">${permohonan.nik ?? ""}</td></tr>
      <tr><td class="col-label">Nama</td><td class="col-colon">:</td><td class="col-value">${permohonan.nama ?? ""}</td></tr>
      <tr><td class="col-label">Tempat, Tgl. Lahir</td><td class="col-colon">:</td><td class="col-value">${formatTempatTanggalLahir(permohonan.tempat_lahir, permohonan.tanggal_lahir)}</td></tr>

      <tr class="no-underline">
        <td class="col-label">Jenis Kelamin*</td><td class="col-colon">:</td>
        <td class="col-value">
          <span class="options">
            <span class="opt"><span class="opt-box ${pilihanCheck(jenisKelamin.includes("laki") || jenisKelamin === "l")}"></span>Laki-Laki</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(jenisKelamin.includes("perempuan") || jenisKelamin === "p")}"></span>Perempuan</span>
          </span>
        </td>
      </tr>

      <tr class="no-underline">
        <td class="col-label">Agama</td><td class="col-colon">:</td>
        <td class="col-value">
          <span class="options">
            <span class="opt"><span class="opt-box ${pilihanCheck(agama === "islam")}"></span>Islam</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(agama === "kristen")}"></span>Kristen</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(agama === "katolik" || agama === "katholik")}"></span>Katholik</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(agama === "budha" || agama === "buddha")}"></span>Budha</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(agama === "hindu")}"></span>Hindu</span>
          </span>
        </td>
      </tr>

      <tr class="no-underline">
        <td class="col-label">Status Perkawinan*</td><td class="col-colon">:</td>
        <td class="col-value">
          <span class="options">
            <span class="opt"><span class="opt-box ${pilihanCheck(statusKawin === "kawin")}"></span>Kawin</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(statusKawin === "belum kawin")}"></span>Belum Kawin</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(statusKawin === "cerai hidup")}"></span>Cerai Hidup</span>
            <span class="opt"><span class="opt-box ${pilihanCheck(statusKawin === "cerai mati")}"></span>Cerai Mati</span>
          </span>
        </td>
      </tr>

      <tr class="no-underline">
        <td class="col-label">Pendidikan Terakhir*</td><td class="col-colon">:</td>
        <td class="col-value">
          <span class="options">
            ${["SD","SLTP","SLTA","D1","D2","D3","S1","S2","S3"].map((p) => `<span class="opt"><span class="opt-box ${pilihanCheck(pendidikan === p)}"></span>${p}</span>`).join("")}
          </span>
        </td>
      </tr>

      <tr><td class="col-label">Pekerjaan</td><td class="col-colon">:</td><td class="col-value">${permohonan.pekerjaan ?? ""}</td></tr>
      <tr><td class="col-label">Alamat</td><td class="col-colon">:</td><td class="col-value" style="padding-bottom: 28px;">${permohonan.alamat ?? ""}</td></tr>
      <tr><td class="col-label">Keperluan</td><td class="col-colon">:</td><td class="col-value" style="padding-bottom: 18px;">${permohonan.keperluan ?? permohonan.deskripsi ?? ""}</td></tr>
    </tbody>
  </table>

  <p class="penutup">Demikian surat pengantar ini disampaikan sebagai bahan proses selanjutnya.</p>

  <div class="ttd-wrapper">
    <div class="ttd-block">
      <p>Guntung Manggis, ${tanggalHariIni}</p>
      <p><strong>KETUA RT. ${permohonan.nomor_rt ?? "-"}&nbsp;&nbsp;RW. ${nomorRw}</strong></p>
      <div class="ttd-space"></div>
      <span class="ttd-nama">( ${namaKetuaRt || "...................."} )</span>
    </div>
  </div>

  <p class="footnote">*Tandai Salah Satu</p>
</div>
</body>
</html>`;
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
      "id, nama, nik, alamat, layanan, sub_layanan, tiket, createdat, nomor_rt, telepon, deskripsi, keperluan, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, status_kawin, pendidikan_terakhir, pekerjaan"
    )
    .eq("id", permohonanId)
    .single();

  const permohonan = rawPermohonan as PermohonanRow | null;
  if (fetchError || !permohonan) {
    return NextResponse.json({ error: "Permohonan tidak ditemukan" }, { status: 404 });
  }

  let namaKetuaRt = "";
  if (permohonan.nomor_rt) {
    const { data: rt } = await supabaseAdmin
      .from("rt")
      .select("nomor_rt, nama_ketua")
      .eq("nomor_rt", permohonan.nomor_rt)
      .single();
    namaKetuaRt = ((rt as RtRow | null)?.nama_ketua ?? "").trim();
  }

  const now = new Date();
  const tahun = now.getFullYear();
  const bulan = now.getMonth() + 1;
  const nomorRw = "01";
  const nomorSurat = `RT-${(permohonan.nomor_rt ?? "00").padStart(2, "0")}/RW-${nomorRw}/${permohonan.tiket}/${bulan}/${tahun}`;
  const tanggalHariIni = formatTanggalIndonesia(now);

  const logoPath = path.join(process.cwd(), "img", "Lambang_Kota_Banjarbaru.svg-removebg-preview.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  const html = renderHtmlTemplate({
    permohonan,
    namaKetuaRt,
    nomorRw,
    nomorSurat,
    tanggalHariIni,
    logoDataUri,
  });

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    const filename = `${permohonan.tiket}-pos.pdf`;
    const storagePath = `${tahun}/${String(bulan).padStart(2, "0")}/${filename}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("surat")
      .upload(storagePath, Buffer.from(pdfBuffer), {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Gagal mengunggah surat baru." }, { status: 500 });
    }

    const { data: urlData } = await supabaseAdmin.storage.from("surat").getPublicUrl(storagePath);
    const suratUrl = urlData.publicUrl;

    const { error: updateError } = await supabaseAdmin
      .from("permohonan")
      .update({ surat_url: suratUrl })
      .eq("id", permohonanId);

    if (updateError) {
      return NextResponse.json({ error: "Gagal update URL surat." }, { status: 500 });
    }

    if (permohonan.telepon) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      const cekTiketLink = baseUrl ? `${baseUrl}/cek-tiket/${permohonan.tiket}` : `/cek-tiket/${permohonan.tiket}`;

      try {
        await sendFonnteWA({
          target: normalizePhone(permohonan.telepon),
          message: [
            `✅ Surat Pengantar (format baru) Anda telah siap.`,
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
        console.error("[surat/generate/pos] Gagal kirim WA:", waError);
      }
    }

    return NextResponse.json({ success: true, suratUrl });
  } finally {
    await browser.close();
  }
}
