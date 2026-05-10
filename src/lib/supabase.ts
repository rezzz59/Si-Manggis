import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set");
    }
    _supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabase;
}

// Re-export so existing imports still work
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});

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
  // New fields for RT routing
  nomor_rt: string | null;
  sub_layanan: string | null;
  deskripsi: string | null;
  lampiran_url: string[] | null;
  fonnte_msg_id: string | null;
  rt_approved_at: string | null;
  rt_approved_via: string | null;
  kelurahan_approved_at: string | null;
  surat_url: string | null;
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
