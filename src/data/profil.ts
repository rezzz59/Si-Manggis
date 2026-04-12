// src/data/profil.ts

export interface PejabatDesa {
  nama: string;
  jabatan: string;
}

export const profilDesa = {
  identitas: {
    namaDesa: "Desa Gunting Manggis",
    kecamatan: "Landasan Ulin",
    kabupaten: "Tanah Laut",
    provinsi: "Kalimantan Selatan",
    kodePos: "36553",
    luasWilayah: "4.250 Ha",
  },

  sejarah: `Desa Gunting Manggis merupakan desa yang terletak di Kecamatan Landasan Ulin, Kabupaten Tanah Laut, Provinsi Kalimantan Selatan. Desa ini dikenal dengan keindahan alamnya, terutama danau yang menjadi sumber kehidupan warga. Nama "Manggis" diambil dari buah manggis yang banyak tumbuh di daerah ini.`,
};

export const pejabatDesa: PejabatDesa[] = [
  { nama: "[Nama Kepala Desa]", jabatan: "Kepala Desa" },
  { nama: "[Nama Sekretaris]", jabatan: "Sekretaris Desa" },
  { nama: "[Nama Kaur 1]", jabatan: "Kaur Umum & Keuangan" },
  { nama: "[Nama Kaur 2]", jabatan: "Kaur Pembangunan" },
  { nama: "[Nama Kasi 1]", jabatan: "Kasi Pemerintahan" },
  { nama: "[Nama Kasi 2]", jabatan: "Kasi Kesejahteraan" },
];

export const visiMisi = {
  visi: "Terwujunya masyarakat Desa Gunting Manggis yang sejahtera, mandani, dan berdaya saing melalui pemanfaatan sumber daya alam dan teknologi digital.",
  misi: [
    "Meningkatkan kualitas dan akses layanan pemerintahan desa secara digital",
    "Mengembangkan potensi ekonomi lokal melalui pertanian, perkebunan, dan peternakan",
    "Memperkuat gotong royong dan partisipasi warga dalam pembangunan desa",
    "Meningkatkan kualitas pendidikan dan kesehatan masyarakat",
    "Melestarikan lingkungan hidup dan sumber daya alam desa",
  ],
};

export const demografi = {
  jumlahPenduduk: "31.000 Jiwa",
  jumlahRT: "51 RT",
  jumlahRW: "6 RW",
  mataPencaharian: ["Pertanian", "Perkebunan (Karet & Kelapa Sawit)", "Peternakan", "Pedagang", "Pegawai Negeri"],
};
