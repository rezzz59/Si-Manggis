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
  createdat: string;
  updatedat: string;
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
  createdat: string;
  updatedat: string;
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
  createdat: string;
  updatedat: string;
};
