import 'dotenv/config';

const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
const TARGET = '6282154218435'; // RT 52 - Rahmat Allam (082154218435 -> 6282154218435)

const fakeTiket = '49302';
const message = [
  `*Si-Manggis — Konfirmasi Permohonan Warga*`,
  ``,
  `━━━━━━━━━━━━━━━━━━`,
  `🎫 Tiket   : ${fakeTiket}`,
  `👤 Nama    : TEST DARI BLACKBOX`,
  `📍 RT      : 52`,
  `📄 Layanan : surat-pengantar`,
  `   Sub     : Surat Domisili`,
  `━━━━━━━━━━━━━━━━━━`,
  `🧪 Ini pesan TES dari sistem Si-Manggis untuk memastikan WA ke RT berfungsi.`,
  `Tidak perlu dibalas.`,
  ``,
  `Balas salah satu format berikut:`,
  `SETUJU ${fakeTiket}`,
  `TOLAK ${fakeTiket} alasan`,
].join('\n');

console.log('Target  :', TARGET);
console.log('Token   :', FONNTE_TOKEN?.slice(0, 8) + '...');
console.log('\n--- Pesan ---');
console.log(message);
console.log('--- Mengirim... ---\n');

const res = await fetch('https://api.fonnte.com/send', {
  method: 'POST',
  headers: { Authorization: FONNTE_TOKEN },
  body: new URLSearchParams({
    target: TARGET,
    message,
    countryCode: '62',
  }),
});

const text = await res.text();
console.log('HTTP Status :', res.status);
console.log('Response    :', text);

try {
  const json = JSON.parse(text);
  if (json.status === true) {
    console.log('\n✅ BERHASIL DIKIRIM ke', TARGET);
  } else {
    console.log('\n❌ GAGAL:', json.reason || 'unknown');
  }
} catch {
  console.log('\n(response bukan JSON)');
}
