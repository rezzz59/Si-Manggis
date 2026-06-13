/**
 * Koordinat overlay surat pengantar (pdf-lib).
 *
 * SATUAN:
 *  - x: jarak dari sisi KIRI halaman (pt)
 *  - top: jarak dari sisi ATAS halaman (pt) — di-flip ke origin pdf-lib
 *         saat render menggunakan helper `yFromTop()` di route.tsx
 *
 * Ukuran halaman template (BLANKO_PENGANTAR_RT_kiri.pdf):
 *  width  = 467.72 pt
 *  height = 609.45 pt
 *
 * Nilai di bawah merupakan koordinat KALIBRASI MANUAL hasil pengukuran
 * pada blanko. Jangan diskalakan lagi — angka ini sudah dalam satuan
 * point template asli.
 */

export type Coord = { x: number; top: number; size?: number; bold?: boolean };

export type BoxRow = {
  startX: number;
  top: number;
  boxW: number;
  gap: number;
  count: number;
  /** padding kiri dalam tiap kotak (fraksi dari boxW). Default 0.27 */
  padXRatio?: number;
};

export type CheckOffset = { x: number; y: number };

export const TEMPLATE_SIZE = {
  width: 467.71655,
  height: 609.4488,
} as const;

/**
 * Offset per BLOK supaya kalibrasi visual cepat:
 * geser 1 angka -> semua field di blok itu ikut bergeser.
 */
export const OFFSET = {
  header: { x: 0, y: 0 }, // nomor surat, nama RT/RW di kop
  body: { x: 0, y: 0 }, // data pemohon, NIK, ttl, dst.
  footer: { x: 0, y: 0 }, // tanggal surat & nama pejabat
} as const;

/**
 * Offset penanda "X" untuk masing-masing kategori checkbox.
 * Disetel terpisah karena tiap baris kotak bisa beda tinggi/lebar.
 */
export const CHECK_OFFSET: Record<
  "jenisKelamin" | "agama" | "statusKawin" | "pendidikan",
  CheckOffset
> = {
  jenisKelamin: { x: 2, y: 1 },
  agama: { x: 2, y: 1 },
  statusKawin: { x: 2, y: 1 },
  pendidikan: { x: 2, y: 1 },
};

export const POS = {
  // Nomor surat: segmen pertama mulai x≈190. Karena RW seharusnya muncul setelah
  // label "RW." (anchor RW=242,top≈108-109), kita geser semua segmen relatif ke
  // anchor barumu.
  nomor: {
    rt: { x: 190, top: 108.45, size: 10 },
    rw: { x: 233, top: 109.45, size: 10 },
    urut: {
      startX: 261,
      top: 105.45,
      boxW: 11,
      gap: 0,
      count: 3,
      padXRatio: 0.3,
    } as BoxRow,
    tahun: {
      startX: 302,
      top: 106.45,
      boxW: 7.25,
      gap: 0,
      count: 4,
      padXRatio: 0.3,
    } as BoxRow,
  },

  // KOLOM KIRI = x 161 (NIK, Nama, TTL, Pekerjaan, Alamat 1-3, Keperluan)
  nik: {
    startX: 161,
    top: 148.45,
    boxW: 14,
    gap: 0,
    count: 16,
    padXRatio: 0.2,
  } as BoxRow,

  ttlDate: {
    dd: { startX: 280.93, top: 143.44, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 } as BoxRow,
    mm: { startX: 303.0, top: 143.44, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 } as BoxRow,
    yyyy: { startX: 326.0, top: 143.44, boxW: 7.86, gap: 0, count: 4, padXRatio: 0.3 } as BoxRow,
  },

  tanggalSurat: {
    dd: { startX: 269.0, top: 338.0, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 } as BoxRow,
    mm: { startX: 291.0, top: 338.0, boxW: 9.43, gap: 0, count: 2, padXRatio: 0.3 } as BoxRow,
    yyyy: { startX: 313.0, top: 338.0, boxW: 7.86, gap: 0, count: 4, padXRatio: 0.3 } as BoxRow,
  },

  // Semua isian kolom kiri pakai x = 161 (sesuai temuanmu).
  // Y mengikuti hasil deteksi anchor label dari template.
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
    namaPejabat: { x: 233.0, top: 404.05, size: 10, bold: true },
  },

  // Checkbox: kolom 1 = 161 (sama dengan kolom kiri).
  // Kolom 2-n mengikuti hasil deteksi agama yang sudah benar -> mempertahankan
  // jarak relatif yang sama untuk jenisKelamin / statusKawin / pendidikan.
  checkbox: {
    // baseline ref dari "agama" yang sudah benar:
    //  islam=162.08, kristen=205.19, katholik=250.49, budha=299.21, hindu=346.33
    // delta dari 162: +43.11, +88.41, +137.13, +184.25
    jenisKelamin: {
      laki: { x: 161, top: 226.96 },
      // perempuan: posisi kolom ke-2 ≈ 161 + 43 = 204 (label "Perempuan" lebih kanan; tetap pakai 204)
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
} as const;
