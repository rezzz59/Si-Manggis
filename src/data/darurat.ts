// src/data/darurat.ts

export type KategoriDarurat = "damkar" | "ambulans" | "poskesdes";

export interface EntriDarurat {
  id: string;
  kategori: KategoriDarurat;
  nama: string;
  alamat: string;
  telepon: string;
  teleponCadangan?: string;
  jamOperasional: string;
  deskripsi?: string;
  mapsEmbedSrc: string;
  warnaBg: string;
  warnaText: string;
}

export const dataDarurat: EntriDarurat[] = [
  {
    id: "damkar-1",
    kategori: "damkar",
    nama: "Pemadam Kebakaran Kecamatan Landasan Ulin",
    alamat: "Jl. Percy STS, Landasan Ulin, Kalimantan Selatan",
    telepon: "113",
    teleponCadangan: "031-1234567",
    jamOperasional: "24 jam",
    deskripsi: "Melayani panggilan darurat kebakaran untuk wilayah Landasan Ulin dan sekitarnya.",
    mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.5!2d114.9!3d-3.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTgnMDAuMCJTIDExNMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v1",
    warnaBg: "bg-orange-50",
    warnaText: "text-orange-600",
  },
  {
    id: "ambulans-1",
    kategori: "ambulans",
    nama: "Ambulans Desa Guntung Manggis",
    alamat: "Balai Desa Guntung Manggis, Kalimantan Selatan",
    telepon: "119",
    teleponCadangan: "0812-3456-7890",
    jamOperasional: "24 jam",
    deskripsi: "Ambulans desa untuk darurat kesehatan warga Guntung Manggis.",
    mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.5!2d114.9!3d-3.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTgnMDAuMCJTIDExNMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v2",
    warnaBg: "bg-red-50",
    warnaText: "text-red-600",
  },
  {
    id: "poskesdes-1",
    kategori: "poskesdes",
    nama: "Pos Kesehatan Desa Guntung Manggis",
    alamat: "Jl. Desa Guntung Manggis, Kalimantan Selatan",
    telepon: "0812-3456-7891",
    jamOperasional: "Senin-Jumat: 08.00 - 16.00 WIB",
    deskripsi: "Pelayanan kesehatan dasar, ibu hamil, balita, dan Imunisasi.",
    mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.5!2d114.9!3d-3.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTgnMDAuMCJTIDExNMKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v3",
    warnaBg: "bg-emerald-50",
    warnaText: "text-emerald-600",
  },
];
