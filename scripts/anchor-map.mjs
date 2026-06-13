// Map label PDF -> koordinat ideal isian.
// Pakai: node scripts/anchor-map.mjs
// Output: JSON ke stdout
import fs from "node:fs";

const HTML = "/tmp/labels.html";
if (!fs.existsSync(HTML)) {
  console.error("Jalankan dulu: pdftotext -bbox-layout public/template/BLANKO_PENGANTAR_RT_kiri.pdf /tmp/labels.html");
  process.exit(1);
}
const xml = fs.readFileSync(HTML, "utf8");

// Parse semua <word ...>TEXT</word>
const re = /<word\s+xMin="([\d.]+)"\s+yMin="([\d.]+)"\s+xMax="([\d.]+)"\s+yMax="([\d.]+)">([^<]*)<\/word>/g;
const words = [];
let m;
while ((m = re.exec(xml)) !== null) {
  words.push({
    xMin: +m[1],
    yMin: +m[2],
    xMax: +m[3],
    yMax: +m[4],
    text: m[5].trim(),
  });
}

// Page size
const pm = /<page\s+width="([\d.]+)"\s+height="([\d.]+)">/.exec(xml);
const pageWidth = pm ? +pm[1] : 0;
const pageHeight = pm ? +pm[2] : 0;

// Gabungkan jadi "lines" per yMin (toleransi 2pt)
function groupLines(ws) {
  const sorted = [...ws].sort((a, b) => a.yMin - b.yMin || a.xMin - b.xMin);
  const lines = [];
  for (const w of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(w.yMin - last.yMin) < 3) {
      last.words.push(w);
      last.yMin = (last.yMin + w.yMin) / 2;
    } else {
      lines.push({ yMin: w.yMin, words: [w] });
    }
  }
  return lines.map((l) => ({
    yMin: l.yMin,
    text: l.words.map((w) => w.text).join(" "),
    words: l.words.sort((a, b) => a.xMin - b.xMin),
  }));
}
const lines = groupLines(words);

function findColonAfter(line, labelMatch) {
  // cari word ":" setelah label
  const idx = line.words.findIndex((w) => labelMatch(w.text));
  if (idx === -1) return null;
  for (let i = idx + 1; i < line.words.length; i++) {
    if (line.words[i].text === ":") return line.words[i];
  }
  return null;
}

function findLineByLabel(matcher) {
  return lines.find((l) => l.words.some((w) => matcher(w.text)));
}

function midY(w) {
  return +((w.yMin + w.yMax) / 2).toFixed(2);
}

function anchorAfterColon(label, lineMatcher, wordMatcher, offsetX = 6) {
  const line = findLineByLabel(lineMatcher);
  if (!line) return null;
  const colon = findColonAfter(line, wordMatcher);
  if (!colon) {
    // fallback: pakai word terakhir + 4pt
    const lastLabel = [...line.words].reverse().find((w) => wordMatcher(w.text));
    if (!lastLabel) return null;
    return {
      anchor: label,
      x: +(lastLabel.xMax + offsetX).toFixed(2),
      y: midY(lastLabel),
    };
  }
  return {
    anchor: label,
    x: +(colon.xMax + offsetX).toFixed(2),
    y: midY(colon),
  };
}

const result = {};

// NIK
const nik = anchorAfterColon("NIK", (t) => /^NIK$/i.test(t), (t) => /^NIK$/i.test(t) || t === ":");
if (nik) result.nik = nik;

// Nama
const nama = anchorAfterColon("Nama", (t) => /^Nama$/i.test(t), (t) => /^Nama$/i.test(t) || t === ":");
if (nama) result.nama = nama;

// Tempat, Tgl. Lahir  (label biasanya "Tempat, Tgl." atau "Tempat" + "Tgl.")
const tempat = anchorAfterColon(
  "Tempat, Tgl. Lahir",
  (t) => /^Tempat,?$/i.test(t) || /^Tempat,/.test(t),
  (t) => /^Tempat/.test(t) || t === ":" || /^Tgl/i.test(t) || /^Lahir$/i.test(t)
);
if (tempat) result.tempatLahir = tempat;

// Pekerjaan
const pek = anchorAfterColon("Pekerjaan", (t) => /^Pekerjaan$/i.test(t), (t) => /^Pekerjaan$/i.test(t) || t === ":");
if (pek) result.pekerjaan = pek;

// Alamat - bisa multi-line
const alamatLine = findLineByLabel((t) => /^Alamat$/i.test(t));
if (alamatLine) {
  const colon = findColonAfter(alamatLine, (t) => /^Alamat$/i.test(t) || t === ":");
  if (colon) {
    result.alamat1 = { anchor: "Alamat", x: +(colon.xMax + 6).toFixed(2), y: midY(colon) };
    // alamat2/3 = baris berikut dengan x sama
    const sameXLines = lines
      .filter((l) => l.yMin > alamatLine.yMin + 5 && l.yMin < alamatLine.yMin + 60)
      .slice(0, 2);
    sameXLines.forEach((l, i) => {
      result[`alamat${i + 2}`] = {
        anchor: "Alamat",
        x: +(colon.xMax + 6).toFixed(2),
        y: +((l.words[0].yMin + l.words[0].yMax) / 2).toFixed(2),
      };
    });
  }
}

// Keperluan
const kep = anchorAfterColon("Keperluan", (t) => /^Keperluan$/i.test(t), (t) => /^Keperluan$/i.test(t) || t === ":");
if (kep) result.keperluan = kep;

// Nomor (segmen RT/RW/urut/tahun) — info debug
const nomorLine = findLineByLabel((t) => /^Nomor$/i.test(t));
if (nomorLine) {
  const colon = findColonAfter(nomorLine, (t) => /^Nomor$/i.test(t) || t === ":");
  if (colon) {
    result.nomor = { anchor: "Nomor", x: +(colon.xMax + 6).toFixed(2), y: midY(colon) };
  }
}

// Jenis Kelamin (checkbox L/P)
const jk = findLineByLabel((t) => /^Jenis$/i.test(t));
if (jk) {
  // cari kata "Laki" dan "Perempuan" pada baris yang sama / dekat
  const candidates = lines.filter((l) => Math.abs(l.yMin - jk.yMin) < 12);
  for (const l of candidates) {
    for (const w of l.words) {
      if (/^Laki/i.test(w.text)) {
        result.jenisKelaminLaki = {
          anchor: "Laki - Laki",
          x: +(w.xMin - 8).toFixed(2),
          y: midY(w),
        };
      }
      if (/^Perempuan/i.test(w.text)) {
        result.jenisKelaminPerempuan = {
          anchor: "Perempuan",
          x: +(w.xMin - 8).toFixed(2),
          y: midY(w),
        };
      }
    }
  }
}

// Agama (5 checkbox)
const agama = findLineByLabel((t) => /^Agama$/i.test(t));
if (agama) {
  const labels = ["Islam", "Kristen", "Katholik", "Budha", "Hindu"];
  const sameY = lines.filter((l) => Math.abs(l.yMin - agama.yMin) < 10);
  for (const l of sameY) {
    for (const w of l.words) {
      for (const name of labels) {
        if (w.text.toLowerCase() === name.toLowerCase()) {
          result[`agama${name}`] = {
            anchor: name,
            x: +(w.xMin - 8).toFixed(2),
            y: midY(w),
          };
        }
      }
    }
  }
}

// Status perkawinan
const sk = findLineByLabel((t) => /^Status$/i.test(t));
if (sk) {
  const labels = ["Kawin", "Belum", "Cerai"];
  const sameY = lines.filter((l) => Math.abs(l.yMin - sk.yMin) < 10);
  for (const l of sameY) {
    for (let i = 0; i < l.words.length; i++) {
      const w = l.words[i];
      const next = l.words[i + 1];
      if (/^Kawin$/i.test(w.text) && (!l.words[i - 1] || !/^Belum$/i.test(l.words[i - 1].text))) {
        result.statusKawin_Kawin = { anchor: "Kawin", x: +(w.xMin - 8).toFixed(2), y: midY(w) };
      }
      if (/^Belum$/i.test(w.text) && next && /^Kawin$/i.test(next.text)) {
        result.statusKawin_BelumKawin = { anchor: "Belum Kawin", x: +(w.xMin - 8).toFixed(2), y: midY(w) };
      }
      if (/^Cerai$/i.test(w.text) && next && /^Hidup$/i.test(next.text)) {
        result.statusKawin_CeraiHidup = { anchor: "Cerai Hidup", x: +(w.xMin - 8).toFixed(2), y: midY(w) };
      }
      if (/^Cerai$/i.test(w.text) && next && /^Mati$/i.test(next.text)) {
        result.statusKawin_CeraiMati = { anchor: "Cerai Mati", x: +(w.xMin - 8).toFixed(2), y: midY(w) };
      }
    }
  }
}

// Pendidikan terakhir
const pend = findLineByLabel((t) => /^Pendidikan$/i.test(t));
if (pend) {
  const labels = ["SD", "SLTP", "SLTA", "D1", "D2", "D3", "S1", "S2", "S3"];
  const sameY = lines.filter((l) => Math.abs(l.yMin - pend.yMin) < 10);
  for (const l of sameY) {
    for (const w of l.words) {
      const idx = labels.findIndex((x) => x.toLowerCase() === w.text.toLowerCase());
      if (idx !== -1) {
        result[`pendidikan_${labels[idx]}`] = {
          anchor: labels[idx],
          x: +(w.xMin - 8).toFixed(2),
          y: midY(w),
        };
      }
    }
  }
}

console.log(JSON.stringify({ page: { width: pageWidth, height: pageHeight }, fields: result }, null, 2));
