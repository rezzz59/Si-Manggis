// src/data/layanan.ts

export interface EntriLayanan {
  id: string;
  nama: string;
  icon: string;
  estimasi: string;
  dokumen: string[];
  warnaBg: string;
  warnaText: string;
}

export const dataLayanan: EntriLayanan[] = [
  {
    id: "surat-keterangan",
    nama: "Surat Keterangan",
    icon: "file-text",
    estimasi: "1–3 hari kerja",
    dokumen: ["KTP asli", "KK asli", "Surat pengantar RT/RW"],
    warnaBg: "bg-blue-50",
    warnaText: "text-blue-600",
  },
  {
    id: "ktp-kk",
    nama: "KTP & Kartu Keluarga",
    icon: "id-card",
    estimasi: "3–7 hari kerja",
    dokumen: ["KTP asli", "KK asli", "Akta lahir", "Pas foto 3x4 (2 lembar)"],
    warnaBg: "bg-indigo-50",
    warnaText: "text-indigo-600",
  },
  {
    id: "izin-keramaian",
    nama: "Izin Keramaian",
    icon: "party-popper",
    estimasi: "2–3 hari kerja",
    dokumen: ["Surat pengantar RT/RW", "Proposal kegiatan", "KTP pemohon"],
    warnaBg: "bg-amber-50",
    warnaText: "text-amber-600",
  },
];
