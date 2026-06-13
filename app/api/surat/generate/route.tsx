import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { sendFonnteWA } from "@/src/lib/fonnte";
import { normalizePhone } from "@/src/lib/fonnte-parser";
import { auth } from "@/src/lib/auth";
import { POS, OFFSET, CHECK_OFFSET, type BoxRow } from "./pos";

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

  // pdf-lib origin: (0,0) di kiri-bawah halaman.
  // Helper di bawah menerima koordinat "dari atas" + offset blok,
  // lalu flip ke koordinat pdf-lib.
  const yFromTop = (top: number, blockOffsetY = 0) => pageHeight - (top + blockOffsetY);

  type Block = keyof typeof OFFSET; // "header" | "body" | "footer"

  const drawField = (
    text: string,
    x: number,
    top: number,
    size = 10,
    useBold = false,
    block: Block = "body"
  ) => {
    const clean = (text ?? "").toString().trim();
    if (!clean) return;
    const off = OFFSET[block];
    page.drawText(clean, {
      x: x + off.x,
      y: yFromTop(top, off.y),
      size,
      font: useBold ? bold : font,
      color: textColor,
    });
  };

  const markIf = (
    condition: boolean,
    x: number,
    top: number,
    category: keyof typeof CHECK_OFFSET = "agama",
    block: Block = "body"
  ) => {
    if (!condition) return;
    const off = OFFSET[block];
    const c = CHECK_OFFSET[category];
    page.drawText("X", {
      x: x + c.x + off.x,
      y: yFromTop(top + c.y, off.y),
      size: 11,
      font: bold,
      color: textColor,
    });
  };

  const drawCharsInBoxes = (
    value: string,
    box: BoxRow,
    options?: { size?: number; onlyDigits?: boolean; block?: Block }
  ) => {
    const raw = (value ?? "").toString();
    const filtered = options?.onlyDigits
      ? raw.replace(/\D/g, "")
      : raw.replace(/[^0-9A-Za-z]/g, "");
    const chars = filtered.slice(0, box.count).split("");
    const block = options?.block ?? "body";
    const off = OFFSET[block];
    const padRatio = box.padXRatio ?? 0.27;
    chars.forEach((ch, idx) => {
      const x = box.startX + idx * (box.boxW + box.gap) + box.boxW * padRatio + off.x;
      page.drawText(ch, {
        x,
        y: yFromTop(box.top, off.y),
        size: options?.size ?? 11,
        font,
        color: textColor,
      });
    });
  };

  /**
   * Word-wrap aman untuk alamat: pecah di spasi, isi tiap baris sampai
   * mendekati `maxChars`, sisanya truncate di baris terakhir.
   */
  const wrapText = (text: string, maxChars: number, maxLines: number): string[] => {
    const clean = (text ?? "").toString().trim().replace(/\s+/g, " ");
    if (!clean) return [];
    const words = clean.split(" ");
    const lines: string[] = [];
    let buf = "";
    for (const w of words) {
      const candidate = buf ? `${buf} ${w}` : w;
      if (candidate.length > maxChars && buf) {
        lines.push(buf);
        buf = w;
        if (lines.length === maxLines - 1) break;
      } else {
        buf = candidate;
      }
    }
    if (buf && lines.length < maxLines) lines.push(buf);
    // sisa kata jika overflow, tempel ke baris terakhir dengan ellipsis
    const used = lines.join(" ").length + lines.length - 1;
    if (used < clean.length && lines.length === maxLines) {
      const last = lines[lines.length - 1];
      const remain = clean.slice(used).trim();
      const tail = `${last} ${remain}`.slice(0, maxChars - 1) + "…";
      lines[lines.length - 1] = tail;
    }
    return lines;
  };

  // Mode debug kalibrasi tersedia di GET /api/surat/generate?debug=1


  drawField((permohonan.nomor_rt ?? "").padStart(2, "0"), POS.nomor.rt.x, POS.nomor.rt.top, POS.nomor.rt.size, false, "header");
  drawField("01", POS.nomor.rw.x, POS.nomor.rw.top, POS.nomor.rw.size, false, "header");
  drawCharsInBoxes(nomorUrut, POS.nomor.urut, { size: 11, onlyDigits: true, block: "header" });
  drawCharsInBoxes(String(tahun), POS.nomor.tahun, { size: 11, onlyDigits: true, block: "header" });

  drawCharsInBoxes(permohonan.nik ?? "", POS.nik, { size: 11, onlyDigits: true });

  drawField(permohonan.nama ?? "", POS.text.nama.x, POS.text.nama.top, POS.text.nama.size);
  drawField(permohonan.tempat_lahir ?? "", POS.text.tempatLahir.x, POS.text.tempatLahir.top, POS.text.tempatLahir.size);

  const tglLahirDigits = formatTanggalLahirId(permohonan.tanggal_lahir).replace(/\D/g, "");
  drawCharsInBoxes(tglLahirDigits.slice(0, 2), POS.ttlDate.dd, { size: 11, onlyDigits: true });
  drawCharsInBoxes(tglLahirDigits.slice(2, 4), POS.ttlDate.mm, { size: 11, onlyDigits: true });
  drawCharsInBoxes(tglLahirDigits.slice(4, 8), POS.ttlDate.yyyy, { size: 11, onlyDigits: true });

  markIf(jenisKelamin === "L", POS.checkbox.jenisKelamin.laki.x, POS.checkbox.jenisKelamin.laki.top, "jenisKelamin");
  markIf(jenisKelamin === "P", POS.checkbox.jenisKelamin.perempuan.x, POS.checkbox.jenisKelamin.perempuan.top, "jenisKelamin");

  markIf(agama === "Islam", POS.checkbox.agama.islam.x, POS.checkbox.agama.islam.top, "agama");
  markIf(agama === "Kristen", POS.checkbox.agama.kristen.x, POS.checkbox.agama.kristen.top, "agama");
  markIf(agama === "Katholik", POS.checkbox.agama.katholik.x, POS.checkbox.agama.katholik.top, "agama");
  markIf(agama === "Budha", POS.checkbox.agama.budha.x, POS.checkbox.agama.budha.top, "agama");
  markIf(agama === "Hindu", POS.checkbox.agama.hindu.x, POS.checkbox.agama.hindu.top, "agama");

  markIf(statusKawin === "Kawin", POS.checkbox.statusKawin.kawin.x, POS.checkbox.statusKawin.kawin.top, "statusKawin");
  markIf(statusKawin === "Belum Kawin", POS.checkbox.statusKawin.belumKawin.x, POS.checkbox.statusKawin.belumKawin.top, "statusKawin");
  markIf(statusKawin === "Cerai Hidup", POS.checkbox.statusKawin.ceraiHidup.x, POS.checkbox.statusKawin.ceraiHidup.top, "statusKawin");
  markIf(statusKawin === "Cerai Mati", POS.checkbox.statusKawin.ceraiMati.x, POS.checkbox.statusKawin.ceraiMati.top, "statusKawin");

  markIf(pendidikan === "SD", POS.checkbox.pendidikan.sd.x, POS.checkbox.pendidikan.sd.top, "pendidikan");
  markIf(pendidikan === "SLTP", POS.checkbox.pendidikan.sltp.x, POS.checkbox.pendidikan.sltp.top, "pendidikan");
  markIf(pendidikan === "SLTA", POS.checkbox.pendidikan.slta.x, POS.checkbox.pendidikan.slta.top, "pendidikan");
  markIf(pendidikan === "D1", POS.checkbox.pendidikan.d1.x, POS.checkbox.pendidikan.d1.top, "pendidikan");
  markIf(pendidikan === "D2", POS.checkbox.pendidikan.d2.x, POS.checkbox.pendidikan.d2.top, "pendidikan");
  markIf(pendidikan === "D3", POS.checkbox.pendidikan.d3.x, POS.checkbox.pendidikan.d3.top, "pendidikan");
  markIf(pendidikan === "S1", POS.checkbox.pendidikan.s1.x, POS.checkbox.pendidikan.s1.top, "pendidikan");
  markIf(pendidikan === "S2", POS.checkbox.pendidikan.s2.x, POS.checkbox.pendidikan.s2.top, "pendidikan");
  markIf(pendidikan === "S3", POS.checkbox.pendidikan.s3.x, POS.checkbox.pendidikan.s3.top, "pendidikan");

  drawField(permohonan.pekerjaan ?? "", POS.text.pekerjaan.x, POS.text.pekerjaan.top, POS.text.pekerjaan.size);

  // Word-wrap alamat: aman dari pemotongan kata di tengah
  const alamatLines = wrapText(permohonan.alamat ?? "", 42, 3);
  drawField(alamatLines[0] ?? "", POS.text.alamat1.x, POS.text.alamat1.top, POS.text.alamat1.size);
  drawField(alamatLines[1] ?? "", POS.text.alamat2.x, POS.text.alamat2.top, POS.text.alamat2.size);
  drawField(alamatLines[2] ?? "", POS.text.alamat3.x, POS.text.alamat3.top, POS.text.alamat3.size);

  drawField(permohonan.keperluan ?? permohonan.deskripsi ?? "", POS.text.keperluan.x, POS.text.keperluan.top, POS.text.keperluan.size);

  const tanggalSuratDigits = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getFullYear())}`;
  drawCharsInBoxes(tanggalSuratDigits.slice(0, 2), POS.tanggalSurat.dd, { size: 11, onlyDigits: true, block: "footer" });
  drawCharsInBoxes(tanggalSuratDigits.slice(2, 4), POS.tanggalSurat.mm, { size: 11, onlyDigits: true, block: "footer" });
  drawCharsInBoxes(tanggalSuratDigits.slice(4, 8), POS.tanggalSurat.yyyy, { size: 11, onlyDigits: true, block: "footer" });

  drawField((permohonan.nomor_rt ?? "").padStart(2, "0"), POS.text.namaRt.x, POS.text.namaRt.top, POS.text.namaRt.size, false, "header");
  drawField("01", POS.text.namaRw.x, POS.text.namaRw.top, POS.text.namaRw.size, false, "header");
  drawField(`(${namaPejabat ?? ""})`, POS.text.namaPejabat.x, POS.text.namaPejabat.top, POS.text.namaPejabat.size, POS.text.namaPejabat.bold, "footer");

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

/**
 * GET /api/surat/generate?debug=1
 * Render PDF kalibrasi (grid 10pt + label sumbu + titik POS + sample teks).
 * Tidak menyimpan ke storage / mengirim WA. Wajib login staff.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (req.nextUrl.searchParams.get("debug") !== "1") {
    return NextResponse.json(
      { error: "Tambahkan ?debug=1 untuk mode kalibrasi" },
      { status: 400 }
    );
  }

  const templatePath = path.join(
    process.cwd(),
    "public",
    "template",
    "BLANKO_PENGANTAR_RT_kiri.pdf"
  );
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const yFromTop = (top: number) => pageHeight - top;

  const grey = rgb(0.85, 0.85, 0.85);
  const dark = rgb(0.4, 0.4, 0.4);
  const blue = rgb(0.1, 0.3, 0.9);
  const red = rgb(0.85, 0.15, 0.15);

  for (let gx = 0; gx <= pageWidth; gx += 10) {
    page.drawLine({
      start: { x: gx, y: 0 },
      end: { x: gx, y: pageHeight },
      thickness: gx % 50 === 0 ? 0.3 : 0.15,
      color: gx % 50 === 0 ? dark : grey,
    });
    if (gx % 50 === 0) {
      page.drawText(`x${gx}`, { x: gx + 1, y: pageHeight - 8, size: 5, font, color: dark });
    }
  }
  for (let gy = 0; gy <= pageHeight; gy += 10) {
    page.drawLine({
      start: { x: 0, y: gy },
      end: { x: pageWidth, y: gy },
      thickness: gy % 50 === 0 ? 0.3 : 0.15,
      color: gy % 50 === 0 ? dark : grey,
    });
    if (gy % 50 === 0) {
      const topVal = pageHeight - gy;
      page.drawText(`t${Math.round(topVal)}`, { x: 2, y: gy + 1, size: 5, font, color: dark });
    }
  }

  const markDot = (x: number, top: number, label: string) => {
    page.drawCircle({ x, y: yFromTop(top), size: 1.5, color: blue });
    page.drawText(label, { x: x + 2, y: yFromTop(top) - 4, size: 4, font, color: blue });
  };
  const walk = (obj: Record<string, unknown>, prefix = "") => {
    for (const k of Object.keys(obj)) {
      const v = (obj as Record<string, unknown>)[k];
      if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        if (typeof o.x === "number" && typeof o.top === "number") {
          markDot(o.x as number, o.top as number, `${prefix}${k}`);
        } else if (typeof o.startX === "number" && typeof o.top === "number") {
          markDot(o.startX as number, o.top as number, `${prefix}${k}[`);
        } else {
          walk(o, `${prefix}${k}.`);
        }
      }
    }
  };
  walk(POS as unknown as Record<string, unknown>);

  const drawSample = (text: string, x: number, top: number, size = 10) => {
    page.drawText(text, { x, y: yFromTop(top), size, font: bold, color: red });
  };
  drawSample("AGUS BUDI SETIAWAN", POS.text.nama.x, POS.text.nama.top, POS.text.nama.size);
  drawSample("Banjarbaru", POS.text.tempatLahir.x, POS.text.tempatLahir.top, POS.text.tempatLahir.size);
  drawSample("Wiraswasta", POS.text.pekerjaan.x, POS.text.pekerjaan.top, POS.text.pekerjaan.size);
  drawSample(
    "Jl. Contoh Kalibrasi No. 123 RT 002 RW 001",
    POS.text.alamat1.x,
    POS.text.alamat1.top,
    POS.text.alamat1.size
  );

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="surat-debug.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
