// src/data/artikel.ts

export interface EntriArtikel {
  slug: string;
  judul: string;
  tanggal: string;
  kategori: string;
  cuplikan: string;
  gambar: string;
  penulis: string;
}

export const dataArtikel: EntriArtikel[] = [
  {
    slug: "pemekaran-rt-52",
    judul: "Pemekaran 52 RT, Kelurahan Tumbuh Cepat di Landasan Ulin",
    tanggal: "15 Oktober 2025",
    kategori: "Pemerintahan",
    cuplikan:
      "Perubahan besar terjadi di Kelurahan Gunting Manggis. Pemekaran 52 RT resmi disahkan Oktober 2025, menandai laju pertumbuhan wilayah yang pesat di kawasan Landasan Ulin.",
    gambar: "/img/Sekilas-Tentang-Danau-Seran.jpg",
    penulis: "Admin Kelurahan",
  },
  {
    slug: "pasar-murah-wengga-kuda",
    judul: "Pasar Murah Mandiri Komplek Wengga Kuda: Pengendalian Inflasi",
    tanggal: "20 Februari 2025",
    kategori: "Ekonomi",
    cuplikan:
      "Guna menjaga stabilitas harga kebutuhan pokok, Pemerintah Kelurahan Gunting Manggis turut hadir dalam Program Pasar Murah Mandiri di Komplek Wengga Kuda.",
    gambar: "/img/Sekilas-Tentang-Danau-Seran.jpg",
    penulis: "Admin Kelurahan",
  },
  {
    slug: "perbaikan-jembatan-guntung-manggis",
    judul: "Perbaikan Jembatan Guntung Manggis, Dinas PUPR Kalseltel Gerak Cepat",
    tanggal: "12 Januari 2026",
    kategori: "Pembangunan",
    cuplikan:
      "Jembatan utama di Kelurahan Gunting Manggis segera diperbaiki. Dinas PUPR Kalimantan Selatan gerak cepat setelah mendapat laporan warga.",
    gambar: "/img/Sekilas-Tentang-Danau-Seran.jpg",
    penulis: "Admin Kelurahan",
  },
  {
    slug: "kampung-kb-nasional",
    judul: "Kampung KB Kelurahan Gunting Manggis, Program Nasional dari BKKBN",
    tanggal: "5 Maret 2025",
    kategori: "Kesejahteraan",
    cuplikan:
      "Kelurahan Gunting Manggis terpilih menjadi percontohan Kampung KB tingkat nasional untuk wilayah Kalimantan Selatan.",
    gambar: "/img/Sekilas-Tentang-Danau-Seran.jpg",
    penulis: "Admin Kelurahan",
  },
  {
    slug: "bank-sampah-8-unit",
    judul: "Bank Sampah 8 Unit Resmi Beroperasi, Kesadaran Lingkungan Meningkat",
    tanggal: "10 April 2025",
    kategori: "Lingkungan",
    cuplikan:
      "Delapan unit bank sampah telah beroperasi di Kelurahan Gunting Manggis. Partisipasi warga meningkat signifikan.",
    gambar: "/img/Sekilas-Tentang-Danau-Seran.jpg",
    penulis: "Admin Kelurahan",
  },
  {
    slug: "koperasi-merah-putih",
    judul: "Koperasi Merah Putih: Program Strategis Nasional, Beroperasi Juli 2025",
    tanggal: "1 Juni 2025",
    kategori: "Ekonomi",
    cuplikan:
      "Koperasi Merah Putih siap beroperasi di Kelurahan Gunting Manggis mulai Juli 2025.",
    gambar: "/img/Sekilas-Tentang-Danau-Seran.jpg",
    penulis: "Admin Kelurahan",
  },
];
