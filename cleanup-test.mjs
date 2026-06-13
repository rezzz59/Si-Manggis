import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Hapus data tes
const { error: e1, count: c1 } = await supa.from('pengaduan').delete({ count: 'exact' }).eq('nama', 'TEST TIKET PENDEK');
console.log('Pengaduan dihapus:', c1, e1?.message ?? '');

const { error: e2, count: c2 } = await supa.from('permohonan').delete({ count: 'exact' }).eq('nama', 'TEST DELETE_ME');
console.log('Permohonan dihapus:', c2, e2?.message ?? '');
