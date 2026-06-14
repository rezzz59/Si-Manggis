export type KBItem = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  link?: string;
};

export const CHATBOT_KB: KBItem[] = [
  {
    id: "tentang-website",
    title: "Tentang Website SI-MANGGIS",
    content:
      "SI-MANGGIS adalah website layanan digital Kelurahan Guntung Manggis untuk membantu warga mengakses layanan pengajuan surat, pengaduan, cek status tiket, informasi profil kelurahan, kontak resmi, dan informasi darurat secara lebih mudah.",
    tags: [
      "halo",
      "hai",
      "website",
      "si-manggis",
      "ini website apa",
      "tentang",
      "apa itu",
      "platform",
      "fungsi website",
      "kegunaan website",
    ],
    link: "/",
  },
  {
    id: "layanan-umum",
    title: "Layanan Pengajuan Surat",
    content:
      "Warga dapat mengajukan layanan administrasi melalui halaman layanan. Pilih jenis layanan yang dibutuhkan, isi data pada formulir pengajuan, lalu kirim permohonan. Setelah dikirim, pengajuan akan diproses sesuai alur verifikasi kelurahan. Statusnya bisa dipantau menggunakan nomor tiket di halaman cek tiket.",
    tags: [
      "layanan",
      "pengajuan",
      "surat",
      "administrasi",
      "permohonan",
      "cara pengajuan",
      "gimana pengajuan",
      "bagaimana pengajuan",
      "langkah pengajuan",
      "ajukan layanan",
      "buat surat",
      "proses layanan",
      "alur layanan",
    ],
    link: "/layanan",
  },
  {
    id: "jenis-layanan",
    title: "Jenis Layanan di SI-MANGGIS",
    content:
      "Layanan mencakup pengajuan surat pengantar dan layanan administrasi warga lainnya yang tersedia pada kartu layanan di halaman layanan. Warga dapat memilih layanan sesuai kebutuhan dan mengikuti instruksi formulir.",
    tags: [
      "jenis layanan",
      "layanan apa saja",
      "daftar layanan",
      "surat pengantar",
      "layanan tersedia",
      "opsi layanan",
      "kategori layanan",
    ],
    link: "/layanan",
  },
  {
    id: "pengaduan",
    title: "Pengaduan dan Aspirasi",
    content:
      "Warga bisa menyampaikan pengaduan atau aspirasi melalui halaman pengaduan. Sertakan deskripsi yang jelas, lokasi, dan lampiran bila perlu agar tindak lanjut lebih cepat.",
    tags: [
      "pengaduan",
      "aspirasi",
      "lapor",
      "keluhan",
      "aduan",
      "komplain",
      "laporan warga",
      "sampaikan masalah",
      "cara lapor",
    ],
    link: "/pengaduan",
  },
  {
    id: "lampiran-pengaduan",
    title: "Lampiran Pengaduan",
    content:
      "Pada pengaduan, warga disarankan menambahkan deskripsi kronologi, lokasi kejadian, dan lampiran pendukung agar laporan lebih mudah diverifikasi dan diproses.",
    tags: [
      "lampiran",
      "bukti",
      "foto",
      "unggah file",
      "dokumen pendukung",
      "isi pengaduan",
      "kronologi",
      "lokasi laporan",
    ],
    link: "/pengaduan",
  },
  {
    id: "cek-tiket",
    title: "Cek Status Tiket",
    content:
      "Status pengajuan atau pengaduan dapat dicek melalui halaman cek tiket menggunakan nomor tiket. Sistem akan menampilkan progres terkini.",
    tags: [
      "cek tiket",
      "status",
      "tracking",
      "lacak",
      "nomor tiket",
      "cek status",
      "lihat progres",
      "pantau pengajuan",
    ],
    link: "/cek-tiket",
  },
  {
    id: "nomor-tiket",
    title: "Nomor Tiket Pengajuan",
    content:
      "Nomor tiket digunakan untuk melacak perkembangan layanan atau pengaduan. Simpan nomor tiket yang diberikan setelah pengajuan berhasil dikirim.",
    tags: [
      "nomor tiket",
      "kode tiket",
      "id pengajuan",
      "tracking id",
      "lupa tiket",
      "fungsi tiket",
      "cara lacak",
    ],
    link: "/cek-tiket",
  },
  {
    id: "profil-kelurahan",
    title: "Profil Kelurahan Guntung Manggis",
    content:
      "Kelurahan Guntung Manggis berada di Kecamatan Landasan Ulin, Kota Banjarbaru. Profil memuat identitas wilayah, batas wilayah, sejarah singkat, visi misi, dan data demografi.",
    tags: [
      "profil",
      "kelurahan",
      "guntung manggis",
      "demografi",
      "visi",
      "misi",
      "sejarah",
      "identitas wilayah",
      "tentang kelurahan",
    ],
    link: "/profil",
  },
  {
    id: "visi-misi",
    title: "Visi dan Misi Kelurahan",
    content:
      "Halaman profil menampilkan visi dan misi resmi Kelurahan Guntung Manggis beserta penjelasan visi untuk arah pembangunan dan pelayanan masyarakat.",
    tags: [
      "visi misi",
      "visi",
      "misi",
      "arah kelurahan",
      "tujuan kelurahan",
      "program kelurahan",
    ],
    link: "/profil",
  },
  {
    id: "artikel",
    title: "Berita dan Informasi Desa",
    content:
      "Informasi berita terbaru desa tersedia di halaman artikel. Warga dapat membaca kabar pemerintahan, pembangunan, dan kegiatan masyarakat.",
    tags: [
      "artikel",
      "berita",
      "informasi",
      "kabar desa",
      "pengumuman",
      "berita terbaru",
      "update desa",
    ],
    link: "/artikel",
  },
  {
    id: "kontak",
    title: "Kontak Kelurahan",
    content:
      "Untuk informasi lebih lanjut atau kebutuhan yang tidak tersedia di sistem, warga dapat menghubungi kontak resmi kelurahan melalui halaman kontak.",
    tags: [
      "kontak",
      "telepon",
      "email",
      "alamat",
      "jam operasional",
      "hubungi petugas",
      "nomor kantor",
      "whatsapp",
    ],
    link: "/kontak",
  },
  {
    id: "darurat",
    title: "Informasi Darurat",
    content:
      "Halaman darurat menyediakan nomor kontak penting untuk kondisi mendesak seperti ambulans, damkar, dan layanan terkait.",
    tags: [
      "darurat",
      "ambulans",
      "damkar",
      "kontak penting",
      "nomor darurat",
      "kondisi mendesak",
      "emergency",
    ],
    link: "/darurat",
  },
  {
    id: "sapaan-umum",
    title: "Sapaan Umum Chatbot",
    content:
      "Asisten SI-MANGGIS siap membantu pertanyaan seputar layanan, pengaduan, cek tiket, profil kelurahan, kontak, artikel, dan informasi darurat di website ini.",
    tags: [
      "selamat pagi",
      "selamat siang",
      "selamat sore",
      "selamat malam",
      "halo min",
      "hai min",
      "pagi",
      "siang",
      "sore",
      "malam",
      "bisa bantu",
      "tolong bantu",
    ],
    link: "/",
  },
];
