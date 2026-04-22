import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type Staff = {
  id: string;
  email: string;
  nama: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type Permohonan = {
  id: string;
  tiket: string;
  nama: string;
  nik: string | null;
  alamat: string;
  layanan: string;
  keperluan: string;
  telepon: string;
  status: string;
  catatan: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Pengaduan = {
  id: string;
  tiket: string;
  nama: string;
  telepon: string | null;
  email: string | null;
  topik: string;
  pesan: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
