import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const hashedPassword = await bcrypt.hash("staff2026", 12);

  // Seed staff
  const { error: staffError } = await supabase.from("staff").upsert(
    {
      id: crypto.randomUUID(),
      email: "admin@desaguntungmanggis.id",
      nama: "Administrator",
      password: hashedPassword,
    },
    { onConflict: "email" }
  );

  if (staffError) {
    console.error("Seed staff error:", staffError.message);
  } else {
    console.log("Seed done: admin@desaguntungmanggis.id / staff2026");
  }

  // Seed sample permohonan
  const samplePermohonan = [
    {
      id: crypto.randomUUID(),
      tiket: "SM-2026-100001",
      nama: "Ahmad Hidayat",
      nik: "6371025406870001",
      alamat: "Jl. Pelita No. 5, Desa Guntang Manggis",
      layanan: "surat-keterangan-domisili",
      keperluan: "Saya butuh surat keterangan domisili untuk pendaftaran sekolah anak saya di SD Negeri 1 Guntang Manggis.",
      telepon: "081234567890",
      status: "SELESAI",
      catatan: "Surat sudah bisa diambil di kantor desa.",
      createdAt: "2026-04-18T08:30:00Z",
      updatedAt: "2026-04-20T14:00:00Z",
    },
    {
      id: crypto.randomUUID(),
      tiket: "SM-2026-100002",
      nama: "Siti Aminah",
      nik: "6371025406870002",
      alamat: "Jl. Beringin Kiri No. 12, RT 15 RW 03",
      layanan: "surat-persetujuan-tetangga",
      keperluan: "Renovasi rumah bagian belakang, butuh persetujuan tetangga.",
      telepon: "085234567891",
      status: "DIPROSES",
      catatan: null,
      createdAt: "2026-04-19T10:15:00Z",
      updatedAt: "2026-04-19T10:15:00Z",
    },
    {
      id: crypto.randomUUID(),
      tiket: "SM-2026-100003",
      nama: "Budi Santoso",
      nik: null,
      alamat: "Komplek Wengga Kuda Blok B-8",
      layanan: "surat-pengantar-kk",
      keperluan: "Pengajuan KK baru karena baru pindah dari daerah lain.",
      telepon: "081987654321",
      status: "MENUNGGU",
      catatan: null,
      createdAt: "2026-04-21T14:00:00Z",
      updatedAt: "2026-04-21T14:00:00Z",
    },
    {
      id: crypto.randomUUID(),
      tiket: "SM-2026-100004",
      nama: "Rina Marlina",
      nik: "6371025406870004",
      alamat: "Jl. Permata No. 7, RT 22 RW 06",
      layanan: "surat-keterangan-tidak-mampu",
      keperluan: "Butuh surat keterangan tidak mampu untuk bantuan biaya sekolah anak.",
      telepon: "085312345678",
      status: "MENUNGGU",
      catatan: null,
      createdAt: "2026-04-22T09:00:00Z",
      updatedAt: "2026-04-22T09:00:00Z",
    },
  ];

  for (const p of samplePermohonan) {
    await supabase.from("permohonan").upsert(p, { onConflict: "tiket" });
  }
  console.log(`Seed ${samplePermohonan.length} sample permohonan`);

  // Seed sample pengaduan
  const samplePengaduan = [
    {
      id: crypto.randomUUID(),
      tiket: "SM-2026-200001",
      nama: "Hendra Wijaya",
      telepon: "081234111222",
      email: "hendra.wijaya@gmail.com",
      topik: "Pembangunan Infrastruktur",
      pesan: "Jalan di RT 18 RW 04 sudah berlubang besar dan berbahaya untukDilaluan especially anak-anak sekolah. Mohon segera diperbaiki.",
      status: "SELESAI",
      createdAt: "2026-04-15T11:00:00Z",
      updatedAt: "2026-04-18T16:00:00Z",
    },
    {
      id: crypto.randomUUID(),
      tiket: "SM-2026-200002",
      nama: "Dewi Lestari",
      telepon: "085234111333",
      email: null,
      topik: "Kebersihan & Drainase",
      pesan: "Saluran air di depan rumah saya tersumbat sampah sudah seminggu. Air meluap setiap sore hujan.",
      status: "DIPROSES",
      createdAt: "2026-04-19T15:30:00Z",
      updatedAt: "2026-04-20T09:00:00Z",
    },
    {
      id: crypto.randomUUID(),
      tiket: "SM-2026-200003",
      nama: "Maman Surjaman",
      telepon: null,
      email: "maman.s@mail.com",
      topik: "Keamanan & Ketertiban",
      pesan: "Mohon perhatian untukwarga yang melepaskanternak itik di jalan umum. Sudah beberapa kali menyebabkan kemacetan.",
      status: "MENUNGGU",
      createdAt: "2026-04-22T08:00:00Z",
      updatedAt: "2026-04-22T08:00:00Z",
    },
  ];

  for (const p of samplePengaduan) {
    await supabase.from("pengaduan").upsert(p, { onConflict: "tiket" });
  }
  console.log(`Seed ${samplePengaduan.length} sample pengaduan`);

  console.log("All seed done!");
}

main().catch(console.error);
