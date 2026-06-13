// Pratinjau cepat tata letak overlay surat pengantar.
// Pakai: node scripts/preview-surat-debug.mjs
// Output: <project-root>/surat-debug.pdf
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Koordinat kalibrasi MANUAL (sama persis dengan app/api/surat/generate/pos.ts)
const POS = {
  nomor: {
    rt: { x: 190, top: 108.45, size: 10 },
    rw: { x: 233, top: 109.45, size: 10 },
    urut: { startX: 261, top: 105.45, boxW: 11, gap: 0, count: 3, padXRatio: 0.3 },
    tahun: { startX: 302, top: 106.45, boxW: 7.25, gap: 0, count: 4, padXRatio: 0.3 },
  },
  nik: { startX: 161, top: 148.45, boxW: 14, gap: 0, count: 16, padXRatio: 0.2 },
  ttlDate: {
    dd: { startX: 280.93, top: 143.44, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 },
    mm: { startX: 303.0, top: 143.44, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 },
    yyyy: { startX: 326.0, top: 143.44, boxW: 7.86, gap: 0, count: 4, padXRatio: 0.3 },
  },
  tanggalSurat: {
    dd: { startX: 269.0, top: 338.0, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 },
    mm: { startX: 291.0, top: 338.0, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 },
    yyyy: { startX: 313.0, top: 338.0, boxW: 7.86, gap: 0, count: 4, padXRatio: 0.3 },
  },
  text: {
    nama: { x: 161, top: 178.98, size: 10 },
    tempatLahir: { x: 161, top: 203.4, size: 10 },
    pekerjaan: { x: 161, top: 325.46, size: 10 },
    alamat1: { x: 161, top: 349.87, size: 10 },
    alamat2: { x: 161, top: 366.0, size: 10 },
    alamat3: { x: 161, top: 382.0, size: 10 },
    keperluan: { x: 161, top: 398.7, size: 10 },
    kotaTanggal: { x: 200.0, top: 339.62, size: 9 },
    namaRt: { x: 219.64, top: 45.71, size: 9 },
    namaRw: { x: 255.78, top: 45.71, size: 9 },
    namaPejabat: { x: 233.0, top: 404.05, size: 10 },
  },
  checkbox: {
    jenisKelamin: {
      laki: { x: 161, top: 226.96 },
      perempuan: { x: 204, top: 227.13 },
    },
    agama: {
      islam: { x: 161, top: 250.49 },
      kristen: { x: 205.19, top: 250.33 },
      katholik: { x: 250.49, top: 250.49 },
      budha: { x: 299.21, top: 250.49 },
      hindu: { x: 346.33, top: 250.49 },
    },
    statusKawin: {
      kawin: { x: 161, top: 274.87 },
      belumKawin: { x: 205.19, top: 274.72 },
      ceraiHidup: { x: 275.87, top: 274.88 },
      ceraiMati: { x: 345.82, top: 274.88 },
    },
    pendidikan: {
      sd: { x: 161, top: 300.37 },
      sltp: { x: 192.98, top: 300.22 },
      slta: { x: 228.82, top: 300.38 },
      d1: { x: 266.34, top: 300.38 },
      d2: { x: 294.69, top: 300.38 },
      d3: { x: 322.98, top: 300.38 },
      s1: { x: 349.81, top: 300.38 },
      s2: { x: 377.77, top: 300.38 },
      s3: { x: 405.16, top: 300.38 },
    },
  },
};

async function main() {
  const root = process.cwd();
  const tmpl = path.join(root, "public", "template", "BLANKO_PENGANTAR_RT_kiri.pdf");
  const bytes = fs.readFileSync(tmpl);
  const pdf = await PDFDocument.load(bytes);
  const page = pdf.getPages()[0];
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const W = page.getWidth(), H = page.getHeight();
  const yt = (top) => H - top;
  const grey = rgb(0.85, 0.85, 0.85), dark = rgb(0.4, 0.4, 0.4),
        blue = rgb(0.1, 0.3, 0.9), red = rgb(0.85, 0.15, 0.15);

  // Grid 10pt + label 50pt
  for (let gx = 0; gx <= W; gx += 10) {
    page.drawLine({ start:{x:gx,y:0}, end:{x:gx,y:H}, thickness: gx%50===0?0.3:0.15, color: gx%50===0?dark:grey });
    if (gx%50===0) page.drawText(`x${gx}`,{x:gx+1,y:H-8,size:5,font,color:dark});
  }
  for (let gy = 0; gy <= H; gy += 10) {
    page.drawLine({ start:{x:0,y:gy}, end:{x:W,y:gy}, thickness: gy%50===0?0.3:0.15, color: gy%50===0?dark:grey });
    if (gy%50===0) page.drawText(`t${Math.round(H-gy)}`,{x:2,y:gy+1,size:5,font,color:dark});
  }

  // Marker biru pada setiap koordinat POS
  const dot = (x, top, label) => {
    page.drawCircle({ x, y: yt(top), size:1.5, color: blue });
    page.drawText(label,{ x:x+2, y:yt(top)-4, size:4, font, color:blue });
  };
  const walk = (o, p="") => {
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (v && typeof v === "object") {
        if (typeof v.x === "number" && typeof v.top === "number") dot(v.x, v.top, p+k);
        else if (typeof v.startX === "number" && typeof v.top === "number") dot(v.startX, v.top, p+k+"[");
        else walk(v, p+k+".");
      }
    }
  };
  walk(POS);

  // ============== DATA DUMMY LENGKAP ==============
  // Tujuan: lihat setiap field terisi sekaligus agar mudah menilai
  //         apakah koordinatnya sudah pas atau perlu digeser.
  const DUMMY = {
    // Nomor surat
    nomor_urut: "012",
    nomor_rt: "07",
    nomor_rw: "01",
    nomor_tahun: "2026",
    // Data pribadi
    nik: "6372031234567890",
    nama: "AHMAD FAUZI RAMADHAN",
    tempat_lahir: "Banjarbaru",
    tgl_lahir: { dd: "15", mm: "08", yyyy: "1995" },
    jenis_kelamin: "L", // "L" / "P"
    agama: "Islam", // Islam, Kristen, Katholik, Budha, Hindu
    status_kawin: "Belum Kawin", // Kawin, Belum Kawin, Cerai Hidup, Cerai Mati
    pendidikan: "S1", // SD, SLTP, SLTA, D1, D2, D3, S1, S2, S3
    pekerjaan: "Wiraswasta",
    alamat: "Jl. Karang Anyar I No. 123 RT 007 RW 001 Kel. Guntung Manggis",
    keperluan: "Pengantar pembuatan KTP elektronik baru",
    // Footer
    kota: "Guntung Manggis",
    tgl_surat: { dd: "12", mm: "06", yyyy: "2026" },
    nama_pejabat: "(SURAHMAN, S.E)",
  };

  // Helper: draw teks isian
  const T = (s, c, opt = {}) =>
    page.drawText(String(s), {
      x: c.x,
      y: yt(c.top),
      size: opt.size ?? c.size ?? 10,
      font: opt.bold ? bold : font,
      color: opt.color ?? red,
    });

  // Helper: char-in-boxes (NIK/tanggal/nomor)
  const TB = (str, box) => {
    const chars = String(str).slice(0, box.count).split("");
    const pad = (box.padXRatio ?? 0.27) * box.boxW;
    chars.forEach((ch, i) => {
      const x = box.startX + i * (box.boxW + box.gap) + pad;
      page.drawText(ch, { x, y: yt(box.top), size: 11, font, color: red });
    });
  };

  // Helper: centang X
  const X = (c) =>
    page.drawText("X", { x: c.x + 2, y: yt(c.top + 1), size: 11, font: bold, color: red });

  // ============== TULIS ==============
  // Nomor surat
  T(DUMMY.nomor_rt, POS.nomor.rt);
  T(DUMMY.nomor_rw, POS.nomor.rw);
  TB(DUMMY.nomor_urut, POS.nomor.urut);
  TB(DUMMY.nomor_tahun, POS.nomor.tahun);

  // NIK & data pemohon
  TB(DUMMY.nik, POS.nik);
  T(DUMMY.nama, POS.text.nama);
  T(DUMMY.tempat_lahir, POS.text.tempatLahir);
  TB(DUMMY.tgl_lahir.dd, POS.ttlDate.dd);
  TB(DUMMY.tgl_lahir.mm, POS.ttlDate.mm);
  TB(DUMMY.tgl_lahir.yyyy, POS.ttlDate.yyyy);

  // Checkbox
  if (DUMMY.jenis_kelamin === "L") X(POS.checkbox.jenisKelamin.laki);
  if (DUMMY.jenis_kelamin === "P") X(POS.checkbox.jenisKelamin.perempuan);

  const agamaKey = { Islam: "islam", Kristen: "kristen", Katholik: "katholik", Budha: "budha", Hindu: "hindu" }[DUMMY.agama];
  if (agamaKey) X(POS.checkbox.agama[agamaKey]);

  const skKey = { Kawin: "kawin", "Belum Kawin": "belumKawin", "Cerai Hidup": "ceraiHidup", "Cerai Mati": "ceraiMati" }[DUMMY.status_kawin];
  if (skKey) X(POS.checkbox.statusKawin[skKey]);

  const pendKey = { SD: "sd", SLTP: "sltp", SLTA: "slta", D1: "d1", D2: "d2", D3: "d3", S1: "s1", S2: "s2", S3: "s3" }[DUMMY.pendidikan];
  if (pendKey) X(POS.checkbox.pendidikan[pendKey]);

  T(DUMMY.pekerjaan, POS.text.pekerjaan);

  // Alamat (word-wrap sederhana 42 char/baris)
  const wrap = (s, n) => {
    const words = String(s).split(/\s+/);
    const lines = [];
    let buf = "";
    for (const w of words) {
      const cand = buf ? `${buf} ${w}` : w;
      if (cand.length > n && buf) { lines.push(buf); buf = w; }
      else buf = cand;
    }
    if (buf) lines.push(buf);
    return lines;
  };
  const alamatLines = wrap(DUMMY.alamat, 42).slice(0, 3);
  if (alamatLines[0]) T(alamatLines[0], POS.text.alamat1);
  if (alamatLines[1]) T(alamatLines[1], POS.text.alamat2);
  if (alamatLines[2]) T(alamatLines[2], POS.text.alamat3);

  T(DUMMY.keperluan, POS.text.keperluan);

  // Footer
  T(`${DUMMY.kota},`, POS.text.kotaTanggal);
  TB(DUMMY.tgl_surat.dd, POS.tanggalSurat.dd);
  TB(DUMMY.tgl_surat.mm, POS.tanggalSurat.mm);
  TB(DUMMY.tgl_surat.yyyy, POS.tanggalSurat.yyyy);
  T(DUMMY.nomor_rt, POS.text.namaRt);
  T(DUMMY.nomor_rw, POS.text.namaRw);
  T(DUMMY.nama_pejabat, POS.text.namaPejabat, { bold: true });

  const out = path.join(root, "surat-debug.pdf");
  fs.writeFileSync(out, await pdf.save());
  console.log("page", W, "x", H);
  console.log("written", out);
}
main().catch((e) => { console.error(e); process.exit(1); });
